define(function(require){
  var
    rad   = require('radagast')
  // , utils = require('utils')
  ;

  return rad.App.extend({
    initialize: function(){
    }
  , render: function(){
      this.$el.html("<h1>Landing Site</h1>");
      console.log(this.apps['test-app']);
      this.apps['test-app'].render();
      this.$el.append(this.apps['test-app'].$el);
    }
  });
});