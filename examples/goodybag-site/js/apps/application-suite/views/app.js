define(function(require){
  var
    rad   = require('radagast')
  , utils = rad.utils
  , Suite = rad.Suite
  ;

  return Suite.extend({
    className: 'applications'

  , regions: {
      '.main-app': [
        'landing-site'
      , 'consumer-panel'
      ]
    }

  , initialize: function(options){
      // this.setRegions({
      //   '.apps-container': ['landing-site', 'consumer-panel'];
      // , '.nav': 'suite-navigation'
      // });
      this.$el.html('<div class="main-app" />');
    }

  , open: function(appName, callback){
      // this.region('.apps-container').open(appName);

      // if (this.current) this.close(this.current);
      console.log("opening ", appName);
      var this_ = this;
      this.instantiateApp(appName, function(app){
        console.log("setting app");
        app.setElement(this_.$el.find('.main-app'));
        app.render();
        this_.current = appName;
        if (callback) callback(app);
      });
    }

  , render: function(){
      // if (this.current){
      //   this.region('.apps-container').open(this.current);
      // }

    }

  , renderApp: function(){

    }
  });
});