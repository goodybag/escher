define(function(require){
  var
    utils       = require('utils')
  , logger      = require('logger')
  , appHandler  = require('apps-handler')
  ;

  return utils.View.extend({
    className: 'app'

  /**
   * Application definitions
   */
  , Apps: {}

  /**
   * Instantiated applications
   */
  , apps: {}

  /**
   * Open applications
   */
  , open: {}

  /**
   * Module dependencies to load
   */
  , dependencies: {}

  , loadDependencies: function(callback){
      var
        this_     = this
      , dependex  = {}
      , depends   = []

      , flattenDepends = function(dependencies){
          var dependency;
          for (var key in dependencies){
            dependency = dependencies[key];
            if (typeof dependency === "string"){
              dependex[key] = depends.push(dependency) - 1;
            }else if (typeof dependency === "object"){
              flattenDepends(dependency);
            }
          }
        }
      ;

      // Require templates and child views
      utils.parallel({
        depends: function(done){
          require(depends, function(){
            var
              args = Array.prototype.slice.call(arguments, 0)

            , applyDepends = function(context, dependencies){
                var dependency;
                for (var key in dependencies){
                  dependency = dependencies[key];
                  if (typeof dependency === "string"){
                    context[key] = args[dependex[key]];
                  }else if (typeof dependency === "object"){
                    context[key] = {};
                    applyDepends(context[key], dependency);
                  }
                }
              }
            ;

            applyDepends(_this, _this.dependencies);
            done();
          });
        }
      , apps: function(done){
          this.initApps(done);
        }
      }, callback);
    }

  , initApps: function(callback){
      var _this = this, numApps = 0, appsLoaded = 0;

      // Count apps that have not bee instantiated yet
      for (var name in this.Apps) if (!this.apps[name]) numApps++;

      // Instantiate Apps
      for (var name in this.Apps){
        // Don't re-instantiate apps
        if (!!this.apps[name]) continue;

        appHandler.get(name, function(error, app){
          if (error) return logger.error(error), callback(error);
          _this.apps[name] = new app.View({
            onReady: function(){
              // Call the original onReadyFunction
              if (_this.Apps[name].onReady) _this.Apps[name].onReady.call(_this.apps[name]);
              if (++appsLoaded === numApps){
                callback();
              }
            }
          });
        });
      }
    }

  , addApp: function(App){
      if (this.appInstantiated(App)) this.destroyApp(App);
      this.Apps[app.name] = app;
      return this;
    }

  , openApp: function(appName, callback){
      if (!this.appExists(appName))
        return logger.warn("App {app} does not exist", { app: appName }), this;

      callback = callback || utils.noop;

      var app, App = this.Apps[appName];

      // Instantiate, render, and add to the dom if we haven't already
      if (!this.appInstantiated(appName)){

        var _this = this, options = {};

        this.instantiateApp(appName, function(){
          app = _this.apps[appName];
          app.render();
          goodToGo();
        });
      }else{
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

  , closeApp: function(appName){
      if (!this.appExists(appName))
        return logger.warn("App {app} does not exist", { app: appName }), this;
      if (!this.appInstantiated(appName))
        return logger.warn("App {app} is not instantiated", { app: appName }), this;
      this.apps[appName].close();
      return this;
    }

  , appExists: function(appName){
      return !!this.apps[appName];
    }

  , appInstantiated: function(appName){
      return !!this.Apps[appName];
    }

  , instantiateApp: function(appName, callback){
      if (!this.appExists(appName)){
        logger.warn("[App.instantiateApp] - App {app} does not exist", { app: appName });
        return this;
      }

      if (this.appInstantiated(appName)){
        logger.warn("[App.instantiateApp] - App {app} has already been instantiated", { app: appName });
        return this;
      }

      var App = this.Apps[appName];

      this.apps[appName] = new App.constructor({
        // Convenience in case the app needs to know
        baseUrl:  (this.baseUrl || "") + App.baseUrl
        // Attach the app to the defined element
      , $el:      App.$el
        // Whenever the app has finished loading resources
      , appReady: callback
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