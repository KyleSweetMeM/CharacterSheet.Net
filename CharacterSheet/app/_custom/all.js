define(function(require) {
	var _i = {
		ko: require('knockout')
	};

	require('./cls');

	require('./bindinghandlers/columnbuilder');
	require('./bindinghandlers/LockScroll');
	require('./bindinghandlers/fadeVisible');
  require('./bindinghandlers/sidebarcollapse');
  require('./bindinghandlers/dropdown');
  require('./bindinghandlers/rangeslider');
  require('./bindinghandlers/rippleeffect');
  require('./bindinghandlers/contentEditable');
  require('./bindinghandlers/htmlEditable');
  require('./bindinghandlers/modal');

  require('./koFunctions/changeTracker');

});
