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

    }

  , render: function(){
      this.$el.html('<div class="main-app" />');
    }

  , renderApp: function(){

    }
  });
});