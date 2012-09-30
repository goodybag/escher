/**
 * Main application view
 * Handles applications via the mediatorish pattern
 */

define(function(require){
  var
    utils     = require('utils')
  , logger    = require('logger')
  , templates = require('templates')
  ;

  return utils.View.extend({
    className: "suite"

  , initialize: function(options){
      this.user    = options.user;
      /**
       * Holds the app definitions and instances
       */
      this.apps    = {};

      /**
       * Current open application
       */
      this.current = null;
      this.numApps = 0;

      // Setup apps
      for (var i = options.apps.length - 1; i >= 0; i--){
        this.addApp(options.apps[i]);
      }

      return this;
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
      this.apps[app.name] = utils.extend({
        instantiated: null
      , _id: this.numApps++
      , View: app.view || app.View
      }, app);
      return this;
    }

  , closeCurrent: function(){
      if (!this.current) return logger.warn("There is no app open"), this;
      this.current.close();
      return this;
    }

  , closeApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn(utils.interpolate("App {app} does not exist", { app: appName })), this;
      if (!this.appInstantiated(appName))
        return logger.warn(utils.interpolate("App {app} is not instantiated", { app: appName })), this;
      this.apps[appName].close();
      if (this.current.name === appName) this.current = null;
    }

  , openApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn(utils.interpolate("App {app} does not exist", { app: appName })), this;
      if (this.current) this.closeCurrent();
      this.current = this.apps[appName];
      if (!this.current.instantiated) this.instantiateApp(appName)
      this.current.open();
      return this;
    }

  , destroyApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn(utils.interpolate("App {app} does not exist", { app: appName })), this;
      var app = this.apps[appName];
      app.destroy();
      app.instantiated = null;
      return this;
    }

  , appExists: function(appName){
      return !!this.apps[appName];
    }

  , appInstantiated: function(appName){
      return !!this.apps[appName].instantiated;
    }

  , instantiateApp: function(appName){
      var app     = this.apps[appName];
      app.instantiated = new app.View({ user: this.user });
      // Proxy some functions for convenience
      app.open    = app.instantiated.open;
      app.isOpen  = app.instantiated.isOpen;
      app.close   = app.instantiated.close;
      app.render  = app.instantiated.render;
      app.destroy = app.instantiated.destroy;
      app.on      = app.instantiated.on;
      app.off     = app.instantiated.off;
      return this;
    }
  });
});
