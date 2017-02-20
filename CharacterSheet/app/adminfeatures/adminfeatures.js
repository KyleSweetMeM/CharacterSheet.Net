define(function (require) {
    var _i = {
        ko: require('knockout'),
        $: require('jquery'),
        utils: require('_custom/services/utils'),
        charajax: require('_custom/services/WebAPI'),
        list: require('_custom/services/listmanager'),
        deferred: require('_custom/deferred'),
        app: require('durandal/app'),
        CustomModal: require('./saveblock'),
        alert: require('_custom/services/alert')
    };

    return function () {
        var self = this;
        self.features = _i.ko.observableArray([]);
        self.newFeature = _i.ko.observable();
        self.deleteList = _i.ko.observableArray([]);
        self.selectedFeature = _i.ko.observable();
        self.currentState = _i.ko.observable('view');

        self.dirtyItems = _i.ko.computed(function () {
            return _i.ko.utils.arrayFilter(self.features(), function (item) {
                return item.dirtyFlag.isDirty();
            });
        });

        self.isDirty = _i.ko.computed(function () {
            return self.dirtyItems().length > 0 || self.deleteList().length > 0;
        });

        self.alertConfig = {  positionX : "right", positionY : "top", effect : "fadeInUp", message : "", type : "success" }

        self.featuresToList = _i.ko.computed(function () {
            var stateToShow = self.currentState();
            if (stateToShow === "view") {
                return _i.list.sortAlphabeticallyObservables(self.features());
            }
            return [];
        });

        self.activate = function () {
            return self.getFeatures();
        };

        self.canDeactivate = function () {
            var promise = _i.deferred.create();

            if (self.isDirty() || self.deleteList().length > 0) {
              _i.CustomModal.show().then(function(response){
                if(response === 'save'){
                  self.save().done(function(){
                    promise.resolve(true);
                  });
                }else if (response === 'continue'){
                  promise.resolve(true);
                }
                else{
                  promise.resolve(false);
                }
              });
            }
            else{
              promise.resolve(true);
            }

            return promise;
        };

        self.getFeatures = function () {
            _i.charajax.getJSON('api/GetAllFeatures', '').done(function (response) {
                var mapped = _i.ko.mapping.fromJS(response);
                mapped().forEach(function (item) {
                    item.dirtyFlag = new _i.ko.dirtyFlag(item);
                });
                self.features(mapped());

                _i.list.sortAlphabeticallyObservables(self.features());
            });
        };

        self.selectFeature = function (obj) {
            self.selectedFeature(obj);
            self.currentState('edit');
        };

        self.createNewFeature = function (feature) {
            self.currentState('new');
            self.newFeature({
                Name: _i.ko.observable(''),
                FeatureId: 0,
                Levelgained: _i.ko.observable(1),
                Description: _i.ko.observable(''),
                RecoveryType: _i.ko.observable(''),
                ActionType: _i.ko.observable(''),
                isSelected: _i.ko.observable(false),
                dirtyFlag: _i.ko.observable(this)
            });
        };

        self.cancelEdit = function () {
          self.resetFromEditState();
        };

        self.resetFromEditState = function(){
          self.selectedFeature().dirtyFlag.reset();
          self.currentState('view');
        };

        self.returnToSelect = function(){
          self.currentState('view');
        };

        self.showAlertMsg = function(textToShow){
            self.alertConfig.message = textToShow;
            _i.app.trigger('view:saved');
            _i.alert.showAlert(self.alertConfig);
        };

        self.save = function () {
            var isSaveState = self.isDirty() || self.selectedFeature.FeatureId === 0;
            var isDeleteState = self.deleteList().length > 0;

            if (isSaveState) { //ADD OR EDIT
                var dataToSave = {
                    Name: self.selectedFeature().Name(),
                    FeatureId: self.selectedFeature().FeatureId(),
                    Levelgained: self.selectedFeature().Levelgained(),
                    Description: self.selectedFeature().Description(),
                    RecoveryType: self.selectedFeature().RecoveryType(),
                    ActionType: self.selectedFeature().ActionType()
                };

                if (dataToSave.FeatureId > 0) { //EDIT
                    return _i.charajax.put('api/EditFeature', dataToSave).done(function (response) {
                        self.resetFromEditState();
                        self.showAlertMsg("Feature Edit Saved");
                    });
                } else { //ADD
                    return _i.charajax.post('api/AddFeature', dataToSave).done(function (response) {
                        self.features.push(response);
                        self.currentState('view');
                        self.showAlertMsg("New Feature Saved");
                    });
                }
            } else if (isDeleteState) { //DELETE
                return _i.charajax.delete('api/RemoveFeature/' + feature.FeatureId, '').done(function (response) {
                    self.showAlertMsg("Feature Deleted: " + feature.Name());
                    self.currentState('view');
                    self.features.remove(feature);
                });
            } else {
                return _i.deferred.createResolved(true);
            }

        };

    }
});
