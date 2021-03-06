﻿using System.Web.Mvc;
using System.Web.Routing;

namespace CharacterSheet
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            //);

            routes.MapRoute(
                name: "LogOut",
                url: "auth/{action}",
                defaults: new { controller = "Auth", action = "index" }
            );

            routes.MapRoute(
                name: "EmptyDefault",
                url: "",
                defaults: new { controller = "CharacterSheet", action = "index" }
            );
        }
    }
}
