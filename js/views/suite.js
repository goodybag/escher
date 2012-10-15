/**
 * Main application view
 * Handles applications via the mediatorish pattern
 */

define(function(require){
  var
    utils     = require('utils')
  , logger    = require('logger')
    // App Views
  , LandingSite   = require('apps/landing-site/app')
  , ConsumerPanel = require('apps/consumer-panel/app')
  ;

  return utils.View.extend({
    className: "suite"

    /**
     * Keeps track of which apps have been instantiated
     */
  , instantiated: {}

  , initialize: function(options){
      /**
       * Current open application
       */
      this.current = null;

      var ensureOpen = function(appName){
        return function(){
          var next = Array.prototype.slice.call(arguments, arguments.length - 1);
          _this.openApp(appName, next);
        };
      };

      /**
       * App Definitions
       */
      this.apps = {
        'consumer-panel': {
          constructor: ConsumerPanel
        , baseUrl: 'panel'
        , middleware: [
            // Make sure we're logged in
            function(){
              // We don't know what parameters might be getting passed to route
              var next = Array.prototype.slice.call(arguments, arguments.length - 1);
              // Ensure we're logged in
              // user.isLoggedIn()
              // If not, re-direct to login and update hash
              // this.openApp('landing-site');
              // Backbone.history.navigate('/apps/landing')
              // If yes, open the app
              // this.openApp('consumer-panel', function(){ next() })
            }

            // Make sure the app is open
          , ensureOpen('consumer-panel')
          ]
        }

      , 'landing-site': {
          constructor: LandingSite
        , baseUrl: 'site'
        , middleware: [ ensureOpen('landing-site') ]
        }
      };

      this.setupApps();

      return this;
    }

  , render: function(){
      this.$el.html('<div class="apps" />');
      return this;
    }

  , setupApps: function(){
      var app, Router, routes, route;
      for (var appName in this.apps){
        app = this.apps[appName];

        // Setup extra middleware
        if (app.middlware && app.middleware.length > 0){
          // Setup the application router
          Router = app.constructor.prototype.Router;
          routes = Router.prototype.routes;
          // Add some middleware to the routes
          for (var routeName in routes){
            if (!routes.hasOwnProperty(routeName)) continue;
            route = routes[routeName];
            if (typeof route === "string") routes[routeName] = [route];
            Array.prototype.unshift.apply(routes[route], app.middleware)
          }

          app.router = new app.constructor.prototype.Router({
            baseUrl: app.baseUrl
          , createTrailingSlashRoutes: true
          });
        }
      }
    }

    /**
     * Add an application to the suite
     * @param {Object} app Manifest of the application
     * @example
     *   {
     *     name: "inside"
     *   , view: AppView
     *   }
     */
  , addApp: function(app){
      if (this.appInstantiated(app)) this.destroyApp(app);
      this.apps[app.name] = app;
      return this;
    }

  , closeCurrent: function(){
      if (!this.current) return logger.warn("There is no app open"), this;
      this.current.close();
      return this;
    }

  , closeApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn("App {app} does not exist", { app: appName }), this;
      if (!this.appInstantiated(appName))
        return logger.warn("App {app} is not instantiated", { app: appName }), this;
      this.instantiated[appName].close();
      if (this.current.name === appName) this.current = null;
    }

  , openApp: function(appName, callback){
      if (!this.appExists(appName))
        return logger.warn("App {app} does not exist", { app: appName }), this;

      callback = callback || utils.noop;

      // Close the current application
      if (this.current) this.closeCurrent();

      // Instantiate, render, and add to the dom if we haven't already
      if (!this.appInstantiated(appName)){
        var _this = this;
        this.instantiateApp(appName, function(){
          _this.current = _this.instantiated[appName];
          _this.current.render();
          _this.$el.find('.apps').append(_this.current.$el);
          goodToGo();
        });
      }else{
        this.current = this.instantiated[appName];
        goodToGo();
      }

      // Once the app has been instantiated, pages loaded, rendered, and appended
      var goodToGo = function(){
        // Check to see if the app has a page open - open the initial if not
        if (!_this.current.current) _this.current.openPage(_this.current.initial);
        _this.current.open();
        callback();
      };

      return this;
    }

  , destroyApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn("App {app} does not exist", { app: appName }), this;
      this.instantiated[appName].destroy();
      this.instantiated[appName] = null;
      return this;
    }

  , appExists: function(appName){
      return !!this.apps[appName];
    }

  , appInstantiated: function(appName){
      return !!this.instantiated[appName];
    }

  , instantiateApp: function(appName, callback){
      if (!this.appExists(appName)){
        logger.warn("[Suite.instantiateApp] - App {app} does not exist");
        return this;
      }

      if (this.appInstantiated(appName)) this.destroyApp(appName);

      this.instantiated[appName] = new this.apps[appName].constructor({
        baseUrl: this.apps[appName].baseUrl
      });

      this.instantiated[appName].loadPages(callback);

      return this;
    }
  });
});
