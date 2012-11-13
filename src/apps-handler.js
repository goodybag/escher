define(function(require){
  var
    utils   = require('utils')
  , errors  = require('errors')
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

    constructor.prototype {
      add: function(name, package){
        if (!name) throw new Error('Need to specify name when creating an app');
        if (!package) throw new Error('Need to specify package when creating an app');
        this.apps[name] = package;
        return this;
      }

      /**
       * Retreives an app module - downloads the resources if needed
       * @param  {String}   name     Name of the module
       * @param  {Function} callback Callback when the module has been received
       * @return {Object}            Instance of the AppHandler object
       */
    , get: function(name, callback){
        if (!this.loaded(name)){
          var this_ = this;
          return require([this.apps[path]], function(module){
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