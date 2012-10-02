define(function(require){
  var
    // 3rd Party Dependencies

    // App Dependencies
    utils     = require('utils')
  , config    = require('config')
  , schema    = require('schemas/consumer')
  , logger    = require('logger')

    // Module Variables
  , consumers = {}
  ;

  /**
   * Retreives an active session from the server
   * @param  {Function} callback Is passed error, consumer
   * @return {null}
   */
  consumers.session = function(callback){
    utils.get('consumers/auth', callback);
  };

  consumers.fbAuth = function(accessToken, callback){
    utils.post('consumers/auth/facebook', { accessToken: accessToken }, callback);
  };

  consumers.register = function(data, callback){
    utils.validate(data, schema.register, function(errors){
      if (errors) return callback(errors);
      utils.post('consumers', data, callback);
    });
  };

  consumers.auth = function(data, callback){
    utils.validate(data, schema.auth, function(errors){
      if (errors) return callback(errors);
      utils.post('consumers/auth', data, callback);
    });
  };

  consumers.tapins = function(options, callback){
    if (typeof options === "function"){
      callback = options;
      options = {};
    }
    var params = (options.params ? utils.paramParser(options.params) : "");
    utils.get('consumers/tapins' + params, options, callback);
  };

  return consumers;
});
