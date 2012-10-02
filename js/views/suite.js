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
     * App Definitions
     */
  , apps: {
      'consumer-panel': ConsumerPanel
    , 'landing-site':   LandingSite
    }

    /**
     * Keeps track of which apps have been instantiated
     */
  , instantiated: {}

  , initialize: function(options){
      /**
       * Current open application
       */
      this.current = null;
      this.numApps = 0;

      return this;
    }

  , render: function(){
      this.$el.html('<div class="apps" />');
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

  , openApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn("App {app} does not exist", { app: appName }), this;

      // Close the current application
      if (this.current) this.closeCurrent();

      // Instantiate, render, and add to the dom if we haven't already
      if (!this.appInstantiated(appName)){
        this.instantiateApp(appName);
        this.current = this.instantiated[appName];
        this.current.render();
        this.$el.find('.apps').append(this.current.$el);
      } else this.current = this.instantiated[appName];

      // Check to see if the app has a page open - open the initial if not
      if (!this.current.current) this.current.openPage(this.current.initial);
      this.current.open();
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

  , instantiateApp: function(appName){
      if (!this.appExists(appName)){
        logger.warn("[Suite.instantiateApp] - App {app} does not exist");
        return this;
      }
      if (this.appInstantiated(appName)) this.destroyApp(appName);
      this.instantiated[appName] = new this.apps[appName]();

      return this;
    }
  });
});
