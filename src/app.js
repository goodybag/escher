define(function(require){
  var
    utils       = require('./utils')
  , logger      = require('./logger')
  , appHandler  = require('./apps-handler')
  , Region      = require('./region')
  ;

  return utils.View.extend({
    className: 'app'

  , constructor: function(options){
      if (options && options.parent) this.parent = options.parent;
      this.apps = {};
      this.Apps = {};

      this.initializeRegions();

      utils.View.prototype.constructor.apply(this, arguments);
    }

    /**
     * Creates an appRegions object that makes regions accessible
     * by application name rather than by the region
     */
  , initializeRegions: function(){
      var region;

      this.appRegions = {};
      for (var selector in this.regions){
        region = this.regions[selector] = new Region(this, selector, this.regions[selector]);

        if (region.isMulti()){
          var apps = region.getAppName();
          for (var i = apps.length - 1; i >= 0; i--){
            this.appRegions[apps[i]] = region;
          }
        }else{
          this.appRegions[region.getAppName()] = region;
        }
      }
    }

  , initApps: function(callback){
      var
        this_         = this
      , deferredApps  = 0
      , appsLoaded    = 0
      , Apps          = this._package.apps
      , appName
      ;

      // Instantiate Apps
      for (var i = Apps.length - 1; i >= 0; i--){
        appName = Apps[i];

        // Don't re-instantiate apps
        if (this.apps[appName]) continue;

        // Don't load apps that want to be deferred
        if (appName.indexOf('defer!') > -1){
          // Strip the defer status
          appName = Apps[i] = appName.substring(appName.lastIndexOf('!') + 1);
          deferredApps++;
          continue;
        }

        this.openApp(appName, function(){
          if (++appsLoaded === Apps.length - deferredApps){
            callback();
          }
        });
      };

      if (Apps.length - deferredApps === 0) callback();
      return this;
    }

  , addApp: function(App){
      if (this.appInstantiated(App)) this.destroyApp(App);
      this.Apps[app.name] = app;
      return this;
    }

  , getApp: function(appName){
      return this.apps[appName];
    }

    /* complete later
  , getApp: function(appName, callback){
      if ()

      if (this.appInstantiated(appName)) return callback(this.apps[appName]), this;
    }*/

  , openApp: function(appName, callback){
      if (!this.appExists(appName))
        return logger.warn("App {app} does not exist", { app: appName }), this;

      callback = callback || utils.noop;

      // Chck with region the app belongs to
      var region = this.appRegions[appName];

      // App has already been instantiated
      if (this.appInstantiated(appName)){
        var app = this.apps[appName];

        // Set the app to the region if it hasn't been done already
        // Region will determine if it needs to append or setElement depending
        // on whether or not it's a multi-app region
        if (!region.hasSetApp(appName)) region.setApp(app);

        region.open(appName);

        return callback(app);
      }

      // Instantiate, render, and add to the dom if we haven't already
      var this_ = this, options = {};

      // Instantiate the app with the element setup with the corresponding region
      // For now, we're just going to set the element afterward via the setApp call
      // if (!region.isMulti()){
      //   options.$el = this.$el.find(region.selector);
      //   region._hasSetApp = true;
      // }

      this.instantiateApp(appName, options, function(error, app){
        if (error) return callback(error);

        // Associate our app with the region
        region.setApp(app);

        // Make sure the correct app is open
        if (region.isMulti()) region.open(appName);

        // Everything set, finally render the view in the region
        region.render();

        // Initialize any child apps
        app.initApps(function(){
          callback(null, app);
        });
      });
      return this;
    }

  , closeApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn("App {app} does not exist", { app: appName }), this;
      if (!this.appInstantiated(appName))
        return logger.warn("App {app} is not instantiated", { app: appName }), this;
      this.apps[appName].close();
      return this;
    }

  , appExists: function(appName){
      return true; // Temp until we fix this shit
      return !!this.Apps[appName];
    }

  , appInstantiated: function(appName){
      return !!this.apps[appName];
    }

  , instantiateApp: function(appName, options, callback){
      if (typeof options === "function"){
        callback = options;
        options = {};
      }

      callback = callback || utils.noop;

      var appName = appName.substring(appName.lastIndexOf('!') + 1);

      logger.info("[App.instantiate] - " + appName);
      if (!this.appExists(appName)){
        logger.warn("[App.instantiateApp] - App {app} does not exist", { app: appName });
        return callback(), this;
      }

      if (this.appInstantiated(appName)){
        logger.warn("[App.instantiateApp] - App {app} has already been instantiated", { app: appName });
        return callback(), this;
      }

      // Set some default stuff on the app view options
      options.parent = this;

      var this_ = this, app;

      // Use the cached version for less round trips
      if (this.Apps[appName]){
        app = this.apps[appName] = new this.Apps[appName](options);

        // Initialize any child apps
        app.initApps(function(){
          callback(app);
        });

        return this;
      };

      // Retrieve the app
      appHandler.get(appName, function(error, App){
        if (error) return callback(error);

        // Cache App definition in case we instantiate again
        this_.Apps[appName] = App;

        app = this_.apps[appName] = new App(options);

        callback(null, app);
      });


      return this;
    }

  , destroyApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn("[App.destroyApp] - App {app} does not exist", { app: appName }), this;
      this.apps[appName].destroy();
      this.apps[appName] = null;
      return this;
    }

  , open: function(){
      this.$el.addClass('open');
      this._isOpen = true;
      return this;
    }

  , close: function(){
      this.$el.removeClass('open');
      this._isOpen = false;
      return this;
    }

  , isOpen: function(){
      // Cast to boolean just in case the _isOpen variable doesn't exist yet
      return !!this._isOpen;
    }

  , destroy: function(){
      // Need to dispose of events and what-not
    }
  });
});