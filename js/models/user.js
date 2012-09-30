define(function(require){
  var
    utils   = require('utils')
  , api     = require('api')
  , config  = require('config')
  , logger  = require('logger')
  ;

  return utils.Model.extend({
    session: function(callback){
      var $this = this;

      logger.info("[user] - Retrieving session");

      api.consumer.session(function(error, data){
        if (error) return logger.error("[user]", error), callback(error);

        logger.info("[user] - Session retrieved! Setting user");

        $this.set(data);
        $this.trigger('authenticate');
        if (callback) callback(null, data);
      });

      return this;
    }

  , emailAuth: function(email, password, callback){
      var $this = this;

      logger.info("[user] - Authenticating");

      api.consumer.auth(email, password, function(error, data){
        if (error) return logger.error("[user]", error), callback(error);

        if (!data)

        logger.info("[user] - Authenticationg success! Setting user");

        $this.set(data);
        $this.trigger('authenticate');
        if (callback) callback(null, data);
      });

      return this;
    }

  , facebookAuth: function(accessToken, callback){
      var $this = this;

      logger.info("[user] - Authenticating");

      api.consumer.auth(accessToken, function(error, data){
        if (error) return logger.error("[user]", error), callback(error);

        logger.info("[user] - Authenticationg success! Setting user");

        $this.set(data);
        $this.trigger('authenticate');
        if (callback) callback(null, data);
      });

      return this;
    }
  });
});
