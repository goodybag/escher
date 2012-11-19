define(function(require){
  var
    rad   = require('radagast')
  , utils = rad.utils
  , Suite = rad.Suite

  , template = require('hbt!./../templates/suite')
  ;

  return Suite.extend({
    template: template

  , initialize: function(options){
      // this.setRegions({
      //   '.apps-container': ['landing-site', 'consumer-panel'];
      // , '.nav': 'suite-navigation'
      // });
      console.log("lkajsdf");
    }

  , open: function(appName){
      // this.region('.apps-container').open(appName);

      this.html(this.template());

      if (this.current) this.close(this.current);
      var this_ = this;
      this.openApp(appName, function(app){
        app.render();
        app.setElement(this_.$el.find('.main-app'));
        this_.current = appName;
      });
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