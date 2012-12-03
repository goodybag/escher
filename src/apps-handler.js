define(function(require){
  var
    utils   = require('./utils')
  , config  = require('./config')

  , Handler = (function(){
      var constructor = function(){
        this.apps   = {};
        this.loaded = {};
        return this;
      };

      constructor.prototype = {
        add: function(package, callback){
          if (!package) throw new Error('Need to specify package when creating an app');

          if (utils.isObject(package) && !utils.isArray(package)){
            if (!package.name) throw new Error('Need to specify name when creating an app');
            if (!package.path) throw new Error('Need to specify path when creating an app');
            this.apps[package.name] = package;
            return callback(), this;
          }

          if (typeof package === "string"){
            package = [package];
          }

          for (var i = package.length - 1; i >= 0; i--){
            package[i] += '/' + config.packageName
          };

          if (!utils.isArray(package)) throw new Error('Invalid package type');

          var this_ = this;
          require(package, function(){
            for (var i = package.length - 1, app; i >= 0; i--){
              app = this_.apps[arguments[i].name] = arguments[i];

              // cache the path to app directory
              app.appDirectory = app.appDirectory || package[i].substring(0, package[i].lastIndexOf('/'));

              // ./ refers to this modules reference, not what the user was intending
              app.path = app.path.replace('./', app.appDirectory + '/');
              app.routerPath = (app.routerPath) ? (app.routerPath.replace('./', app.appDirectory + '/')) : (app.appDirectory + '/router');
            };
            callback();
          });

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
          if (!this.apps[name]) return callback(new Error('App ' + name + ' does not exist'));

          if (!this.isLoaded(name)){
            var this_ = this, app = this.apps[name];

            return require([app.path], function(module){
              // include app.path first, as the router will be defined in that file if compiled
              require([app.routerPath], function(routeHandlers){
                // save some references for instance object
                module.prototype._package = app;
                module.prototype._routeHandlers = routeHandlers;

                // Tell handler we've loaded this module
                this_.loaded[name] = module;
                callback(null, module);
              });
            }), this;
          }
          return callback(null, this.loaded[name]), this;
        }

        /**
         * Checks to see if the app's resources have been loaded yet
         * @param  {String}  name  Name of the module
         * @return {Boolean}
         */
      , isLoaded: function(name){
          return !!this.loaded[name];
        }
      };

      return constructor;
    })();
  ;

  return new Handler();
});
