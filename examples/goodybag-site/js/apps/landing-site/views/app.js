define(function(require){
  var
    rad   = require('radagast')
  // , utils = require('utils')
  ;

  return rad.App.extend({
    regions: {
      '.test-app': 'test-app'
    }

  , initialize: function(){

    }
  , render: function(){
      this.$el.html('<h1>Landing Site</h1><div class="test-app"></div>');
    }
  });
});