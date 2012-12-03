/**
 * Main application view
 * Handles applications via the mediatorish pattern
 */

define(function(require){
  var
    utils   = require('./utils')
  , apps    = require('./apps-handler')
  , App     = require('./app')
  , logger  = require('./logger')

  , logger  = new logger("Suite")

  , defaultRouter = {
      routes: {
        "": "defaultRoute"
      }
    , "defaultRoute": function(){
        console.log("HOWDY!");
      }
    }
  ;

  return App.extend({
    constructor: function(options){
      App.prototype.constructor.apply(this, arguments);

      // If a top-level router has not been specified yet
      if (!utils.Backbone.history || utils.Backbone.history.handlers.length === 0){
        // Top level router has already been specified and we're passing in an instance
        if (options && options.router) this.router = options.router;

        // Specified Router definition, creating top-level router
        else if (options && options.Router) this.router = new utils.Router(options.Router);

        // Use router specified in package
        else if (this._package.router) this.router = new utils.Router(this._package.router);

        // No router specified - we're just going to create a blank one
        else this.router = new utils.Router(defaultRouter);
      }

      var
        this_ = this

      , currentApp = this

      , runMiddleware = function(middleware) {
          return function Middleware__runMiddleware() {
            var self = this, index = -1;
            currentApp = this_;
            var next = function() {
              return middleware[++index].apply(self, (index < middleware.length - 1) ? nextArgs : arguments);
            };
            var nextArgs = Array.prototype.concat.call(arguments, next);
            next();
          }
        }

      , ensureOpen = function(appName){
          return function Middleware__ensureOpen(){
            // Call to routers app.openApp with the appName and the last argument to route fn
            // Last argument will be the 'next' function when using middleware
            var next = arguments[arguments.length - 1], this_ = this;

            appName = appName.substring(appName.lastIndexOf('!') + 1);

            currentApp.openApp(appName, function(){

              /**
               * We shoudl use currentApp.getApp, but since we know it's already ready from
               * Calling open, then I'm just going to dig into the reference right now
               */

              // Advance the app so the next middleware can open it's child
              currentApp = currentApp.apps[appName];
              this_.app = currentApp;
              next();
            });
          };
        }

      , runRoute = function(handlerName) {
          return function Middleware__runRoute() {
            if (!currentApp._routeHandlers[handlerName]) {
              throw "Route handler '"+handlerName+"' not found in "+currentApp._package.name;
            }
            currentApp._routeHandlers[handlerName].apply(currentApp._routeHandlers, arguments);
          }
        }

      , diagram = {}

         /**
          * Given a starting application manifest, this function will evaluate all of the
          * children application routers applying each sub-router to the main suite.
          * Additionally, if those children have children, then those children will be run
          * through the function again as a parent app until there are no more children
          * @param  {Object} parentApp       Application manifest of the current top-level app
          * @param  {String} baseUrl         The URL that should be pre-pended to all children routes
          * @param  {Array}  middleware      The middleware that should be pre-pended to all children routes
          * @param  {Array}  middlewareNames Just for debugging gives the diagram which applications are children of others
          */
      , evaluateRouters = function(parentApp, baseUrl, middleware, middlewareNames){
          var
            childAppName  // - Value of each item in a parent app's apps property
          , childApp      // - The application manifest of a parent app's child app
          , routes        // - Clone of the child app's routes property
          , route         // - Each route endpoint (function) for a child app
          , fullPath      // - Full path including inherited baseUrl
          ;

          // Apply parent history
          baseUrl += parentApp.baseUrl || '';

          for (var i = parentApp.apps.length -1; i >= 0; i--){
            childAppName = parentApp.apps[i];

            // Get the actual app name after plugin behavior like defer
            if (childAppName.indexOf('!') > -1)
              childAppName = childAppName.substring(childAppName.lastIndexOf('!') + 1);

            childApp = apps.lookup(childAppName);

            // Apply parent middleware
            middleware.push(ensureOpen(childAppName));
            middlewareNames.push(childAppName);

            if (childApp.hasOwnProperty('routes')){
              routes = utils.clone(childApp.routes);

              // Loop through all routes and mixin parent middleware
              for (var routePath in routes){
                if (!routes.hasOwnProperty(routePath)) continue;

                // Add route handler loader middleware
                route = middleware.concat(runRoute(routes[routePath]));

                // Create the full route with inherited baseUrl
                if (routePath === '') fullPath = baseUrl + childApp.baseUrl;
                else if (baseUrl === '') fullPath = (childApp.baseUrl || '') + '/' + routePath;
                else fullPath = (baseUrl ? (baseUrl + '/') : '') + (childApp.baseUrl || '') + '/' + routePath;
                if (fullPath.charAt(0) == '/') { fullPath = fullPath.slice(1); }

                // Add to the main router
                this_.router.route(fullPath, fullPath, runMiddleware(route));
                // Also add one with a trailing slash
                this_.router.route(fullPath + '/', fullPath + '/', runMiddleware(route));

                // Diagram everything so I can make sense of this shit
                diagram[fullPath] = middlewareNames.slice(0);
              }
            }

            // Does the child have children?
            if (childApp.apps && childApp.apps.length > 0){
              // Run through the process for all apps
              evaluateRouters(childApp, baseUrl, middleware, middlewareNames);
            }

            middleware.pop();
            middlewareNames.pop();
          }
        }
      ;

      evaluateRouters(this._package, '', [], []);

      console.log("Routers: ", diagram);
    }

  , openApp: function(appName){
      logger.info("Suite.openApp - " + appName);
      App.prototype.openApp.apply(this, arguments);
    }
  });
});
