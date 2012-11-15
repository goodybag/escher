/**
 * Main application view
 * Handles applications via the mediatorish pattern
 */

define(function(require){
  var
    utils   = require('./utils')
  , apps    = require('./apps-handler')
  , App     = require('./app')

  , middleware = []
  , baseUrl = ''
  ;

  return App.extend({
    constructor: function(options){
      App.prototype.constructor.apply(this, arguments);

      // If a top-level router has not been specified yet
      if (!utils.history){
        // Top level router has already been specified and we're passing in an instance
        if (options.router) this.router = options.router;

        // Specified Router definition, creating top-level router
        else if (options.Router) this.router = new utils.Router(options.Router);

        // No router specified - we're just going to create a blank one
        else this.router = new rad.utils.Router(defaultRouter);
      }

      var
        this_ = this

      , currentApp = this

      , ensureOpen = function(appName){
          return function(){
            // Call to routers app.openApp with the appName and the last argument to route fn
            // Last argument will be the 'next' function when using middleware
            currentApp.openApp(appName, function(){
              var callback = Array.prototype.slice.call(arguments, arguments.length - 1);

              /**
               * We shoudl use currentApp.getApp, but since we know it's already ready from
               * Calling open, then I'm just going to dig into the reference right now
               */

              currentApp = currentApp.apps[appName];

              // currentApp.getApp(appName, function(app){
              //   currentApp = app;
              //   callback();
              // });
            });
          };
        }

      , evaluateRouters = function(parentApp){
          var childAppName, childApp, router, route, Router;

          // Apply parent history
          baseUrl += parentApp.baseUrl || '';
          middleware.push(ensureOpen(parentApp.name));

          for (var childAppKey in parentApp){
            childAppName = parentApp[childAppKey];

            // Get the actual app name after plugin behavior like defer
            if (childAppName.indexOf('!') > -1)
              childAppName = childAppName.substring(childAppName.lastIndexOf('!') + 1);

            childApp = apps.lookup(childAppName);

            if (childApp.hasOwnProperty('router')){
              router = utils.clone(childApp.router);

              // Loop through all routes and mixin parent middleware
              for (var routePath in router.routes){
                if (!routes.hasOwnProperty(routePath)) continue;

                route = router[router.routes[routePath]];

                // Force the route to start using middleware-style
                if (typeof route === "function") router[router.routes[routePath]] = [route];

                // Prepend the parent middleware
                Array.prototype.unshift.apply(router[router.routes[routePath]], middleware);
              }

              Router = utils.SubRouter.extend(router);
              // we should save this instance somewhere, but for now it's fine
              new Router(baseUrl + '/' + childApp.baseUrl || '', {
                createTrailingSlashes: true
              });
            }

            // Does the child have children?
            if (childApp.hasOwnProperty('apps')){
              // Run through the process for all apps
              evaluateRouter(childApp);
            }
          }
        }
      ;

      evaluateRouters(this._package);
    }
  });
});