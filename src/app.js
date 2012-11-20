define(function(require){
  var
    utils       = require('./utils')
  , logger      = require('./logger')
  , appHandler  = require('./apps-handler')
  ;

  return utils.View.extend({
    className: 'app'

  , constructor: function(options){
      if (options && options.parent) this.parent = options.parent;
      this.apps = {};
      this.Apps = {};
      console.log("app constructor");
      utils.View.prototype.constructor.apply(this, arguments);
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

        this.instantiateApp(appName, function(){
          if (++appsLoaded === Apps.length - deferredApps){
            callback();
          }
        });
      };

      if (Apps.length - deferredApps === 0) callback();
      return this;
    }

  , setRegions: function(regions){
      for (var region in regions){
        if (!(region in regions)) continue;
        this.setRegion(region);
      }
      return this;
    }

  , setRegion: function(selector, application){
      if (utils.isArray(application)){
        // for ()
      }else{
        this._regions[selector] = application;
      }
    }

  , wireApplicationToRegion: function(region, application){
      // Ensure that we're not trying to wire a non-instantiated app
      if (this.apps[application]){
        // if the region is blank, then it's just the root element
        this.apps[application].setElement(region !== '' ? this.$el.find(region) : this.$el);
      }
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

      var App = this.Apps[appName];

      if (this.appInstantiated(appName)) return callback(this.apps[appName]);

      // Instantiate, render, and add to the dom if we haven't already
      var this_ = this, options = {};
      this.instantiateApp(appName, function(app){
        // app.render();
        callback(app);
      });

      // Old stuff when we had the page abstraction built in
      // Once the app has been instantiated, pages loaded, rendered, and appended
      // var goodToGo = function(){
      //   // Check to see if the app has a page open - open the initial if not
      //   if (!this_.current.current) this_.current.openPage(this_.current.initial);
      //   this_.current.open();
      //   callback();
      // };

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

  , instantiateApp: function(appName, callback){
      var appName = appName.substring(appName.lastIndexOf('!') + 1);

      logger.info("[App.instantiate] - " + appName);
      if (!this.appExists(appName)){
        logger.warn("[App.instantiateApp] - App {app} does not exist", { app: appName });
        return this;
      }

      if (this.appInstantiated(appName)){
        logger.warn("[App.instantiateApp] - App {app} has already been instantiated", { app: appName });
        return this;
      }

      var this_ = this, app;

      if (this.Apps[appName]){
        console.log("lakjsdfkl");
        app = this.apps[appName] = new this.Apps[appName]({
          parent: this_
        });
        app.initApps(function(){
          callback(app);
        });
        return this;
      };

      appHandler.get(appName, function(error, App){
        this_.Apps[appName] = App;

        app = this_.apps[appName] = new App({
          // Convenience in case the app needs to know
          // baseUrl:  (this_._package.baseUrl || "") + App.baseUrl
          // Attach the app to the defined element
        // , $el:      App.$el
          // For application traversal
          parent: this_
        });

        console.log(appName, app);


        app.initApps(function(){
          callback(app);
        });
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

  , closeCurrent: function(){
      if (!this.current) return logger.warn("[App.closeCurrent] - There is no page open"), this;
      this.current.close();
      return this;
    }

  , closePage: function(pageName){
      if (!this.pageExists(pageName))
        return logger.warn("[App.closePage] - Page {page} does not exist", { page: pageName }), this;
      if (!this.pageInstantiated(pageName))
        return logger.warn("[App.closePage] - Page {page} is not instantiated", { page: pageName }), this;
      this.pages[pageName].close();
      if (this.current.name === pageName) this.current = null;
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