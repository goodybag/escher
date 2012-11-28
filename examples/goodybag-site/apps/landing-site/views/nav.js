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
      logger.info('[Nav] - logo click');
      this.trigger('logo:click', this, e);
      e.preventDefault();
    }

  , facebookLoginClick: function(e){
      this.trigger('logo:click', this, e);
    }

  , emailLoginClick: function(e){
      this.trigger('logo:click', this, e);
    }

  , signUpClick: function(e){
      this.trigger('logo:click', this, e);
    }
  });
});
