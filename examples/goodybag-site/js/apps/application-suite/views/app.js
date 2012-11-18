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
      // this.setRegions({
      //   '.apps-container': ['landing-site', 'consumer-panel'];
      // , '.nav': 'suite-navigation'
      // });
    }

  , open: function(app){
      // this.region('.apps-container').open(app);

      if (this.current) this.close(this.current);
      if ()
    }

  , render: function(){
      // if (this.current){
      //   this.region('.apps-container').open(this.current);
      // }

      this.$el.html(this.template());
    }

  , renderApp: function(){

    }
  });
});