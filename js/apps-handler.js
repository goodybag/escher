define(function(require){
  var
    utils   = require('utils')
  , errors  = require('errors')
  ;

  return new (function(){
    var constructor = function(){
      this.apps   = {};
      this.loaded = {};
      return this;
    };

    constructor.prototype {
      add: function(path, name){
        if (!path) throw new Error('Need to specify path when creating an app');
        name = name || path;
        this.apps[name] = path;
        return this;
      }

      /**
       * Retreives an app module - downloads the resources if needed
       * @param  {String}   name     Name of the module
       * @param  {Function} callback Callback when the module has been received
       * @return {Object}            Instance of of the AppHandler object
       */
    , get: function(name, callback){
        if (!this.loaded(name)){
          var this_ = this;
          return require([this.apps[name]], function(module){
            _this[loaded] = module;
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