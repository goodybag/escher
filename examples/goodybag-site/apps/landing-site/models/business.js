define(function(require){
  var
    utils   = require('utils')
  ;

  return utils.Model.extend({
    defaults:{
      publicName:'Public Name'
    }
  });
});
