define(function(require){
  var
    utils     = require('utils')
  , api       = require('api')
  , config    = require('config')
  , logger    = require('logger')
  ;

  return utils.Model.extend({
    defaults: {
      authenticated: false
    }

  , initialize: function(){

    }

  , session: function(callback){
      var $this = this;
      callback = callback || utils.noop;

      logger.info("[user] - Retrieving session");

      api.consumer.session(function(error, data){
        if (error){
          logger.error("[user]", error);
          console.log("triggering deauth");
          $this.trigger('de-auth');
          return callback(error);
        }
        if (!data) return logger.info("[user] - No session available"), callback();

        logger.info("[user] - Session retrieved! Setting user");

        $this.set(data);
        $this.authenticated = true;
        $this.trigger('auth');
        if (callback) callback(null, data);
      });

      return this;
    }

  , emailAuth: function(email, password, callback){
      var $this = this;

      logger.info("[user emailAuth] - Authenticating");

      api.consumer.auth(email, password, function(error, data){
        if (error) return logger.error("[user emailAuth]", error), callback(error);
        if (!data) return logger.error("[user emailAuth] - No user returned"), callback();

        logger.info("[user emailAuth] - Authenticating success! Setting user");

        $this.set(data);
        $this.authenticated = true;
        $this.trigger('auth');
        if (callback) callback(null, data);
      });

      return this;
    }

  , facebookAuth: function(accessToken, callback){
      var $this = this;

      logger.info("[user facebookAuth] - Authenticating");

      api.consumer.auth(accessToken, function(error, data){
        if (error) return logger.error("[user facebookAuth]", error), callback(error);
        if (!data) return logger.error("[user facebookAuth] - No user returned"), callback();

        logger.info("[user facebookAuth] - Authenticating success! Setting user");

        $this.set(data);
        $this.authenticated = true;
        $this.trigger('auth');
        if (callback) callback(null, data);
      });

      return this;
    }

  , isAuthenticated: function(){
      return this.authenticated;
    }
  });
});
