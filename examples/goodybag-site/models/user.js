define(function(require){
  var
    utils     = require('utils')
  , api       = require('api')
  , config    = require('config')
  , Logger    = require('logger')

  , logger    = new Logger("[User]")
  ;

  return utils.Model.extend({
    defaults: {
      authenticated: false
    }

  , initialize: function(){

    }

  , session: function(callback){
      var this_ = this;
      callback = callback || utils.noop;

      logger.info("Retrieving session");

      api.consumer.session(function(error, data){
        if (error){
          logger.error(error);
          console.log("triggering deauth");
          this_.trigger('de-auth');
          return callback(error);
        }
        if (!data) return logger.info("No session available"), callback();

        logger.info("Session retrieved! Setting user");

        this_.set(data);
        this_.authenticated = true;
        this_.trigger('auth');
        if (callback) callback(null, data);
      });

      return this;
    }

  , emailAuth: function(email, password, callback){
      var this_ = this;

      logger.info("emailAuth Authenticating");

      api.consumer.auth(email, password, function(error, data){
        if (error) return logger.error("emailAuth]", error), callback(error);
        if (!data) return logger.error("emailAuth No user returned"), callback();

        logger.info("emailAuth Authenticating success! Setting user");

        this_.set(data);
        this_.authenticated = true;
        this_.trigger('auth');
        if (callback) callback(null, data);
      });

      return this;
    }

  , facebookAuth: function(accessToken, callback){
      var this_ = this;

      logger.info("facebookAuth Authenticating");

      api.consumer.auth(accessToken, function(error, data){
        if (error) return logger.error("facebookAuth]", error), callback(error);
        if (!data) return logger.error("facebookAuth No user returned"), callback();

        logger.info("facebookAuth Authenticating success! Setting user");

        this_.set(data);
        this_.authenticated = true;
        this_.trigger('auth');
        if (callback) callback(null, data);
      });

      return this;
    }

  , isAuthenticated: function(){
      return this.authenticated;
    }
  });
});