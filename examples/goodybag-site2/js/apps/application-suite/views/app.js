define(function(require){
  var
    rad   = require('radagast')
  , utils = rad.utils
  , Suite = rad.Suite

  , template = require('./templates/suite')
  ;

  return Suite.extend({
    template: template

  , initialize: function(options){
      this.current = options.current || 'landing-site';

    }

  , render: function(){
      this.$el.html(this.template());
    }

  , renderApp: function(){

    }
  });
});