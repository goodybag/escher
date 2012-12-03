define(function(require){
  var
    utils     = require('utils')
  , template  = require('hbt!./../html/charities-page')
  ;

  return utils.View.extend({
    initialize: function(){
      this.$el.html(template());
    }
  });
});
