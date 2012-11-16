define(function(require){
  var
    utils   = require('./utils')
  , errors  = require('./errors')
  ;

  /**
   * Singleton in the hizzy!
   */
  return new (function(){
    var constructor = function(){
      this.apps   = {};
      this.loaded = {};
      return this;
    };

    constructor.prototype = {
      add: function(package){
        if (!package) throw new Error('Need to specify package when creating an app');
        if (!package.name) throw new Error('Need to specify name when creating an app');
        if (!package.path) throw new Error('Need to specify path when creating an app');
        this.apps[package.name] = package;
        return this;
      }

    , lookup: function(name){
        return this.apps[name];
      }

    , update: function(name, updated){
        var app = this.apps[name];
        for (var key in updated){
          app[key] = updated[key];
        }
        return this;
      }

      /**
       * Retreives an app module - downloads the resources if needed
       * @param  {String}   name     Name of the module
       * @param  {Function} callback Callback when the module has been received
       * @return {Object}            Instance of the AppHandler object
       */
    , get: function(name, callback){
        if (!this.apps[name]) return callback(new Error('App does not exist'));

        if (!this.loaded(name)){
          var this_ = this, app = this.apps[name];
          return require(app.path, function(module){
            // save some references for instance object
            module.prototype._package = app;
            // Tell handler we've loaded this module
            this_.loaded[name] = module;
            callback(null, module);
          }), this;
        }
        return callback(null, this.loaded[name]), this;
      }

      /**
       * Checks to see if the app's resources have been loaded yet
       * @param  {String}  name  Name of the module
       * @return {Boolean}
       */
    , loaded: function(name){
        return !!this.loaded[name];
      }
    };

    return constructor;
  })();
});