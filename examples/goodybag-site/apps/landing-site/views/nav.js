/**
 * Navigation
 */

define(function(require){
  var
    rad       = require('radagast')
  , utils     = require('utils')
  , template  = require('hbt!./../html/nav')

  , logger    = new rad.logger("LandingSite.Nav")
  ;

  return utils.View.extend({
    events: {
      'click #nav-logo-anchor':     'logoClick'
    , 'click #nav-facebook-login':  'facebookLoginClick'
    , 'click #nav-email-login':     'emailLoginClick'
    , 'click #nav-sign-up':         'signUpClick'
    }

  , initialize: function(){
      this.template = template;
      return this;
    }

  , render: function(){
      this.$el.html(this.template());
      return this;
    }

  , logoClick: function(e){
      e.preventDefault();
      logger.info('Logo click');
    }

  , facebookLoginClick: function(e){
      logger.info('Facebook click');
      this.trigger('logo:click', this, e);
    }

  , emailLoginClick: function(e){
      logger.info('Email click');
      this.trigger('logo:click', this, e);
    }

  , signUpClick: function(e){
      logger.info('Sign-Up click');
      this.trigger('logo:click', this, e);
    }
  });
});
