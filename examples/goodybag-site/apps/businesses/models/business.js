define(function(require){
  var
    utils   = require('utils')
  ;

  return utils.Model.extend({
  	idAttribute: "_id"
  , defaults:{
      publicName:'Public Name'
    }
  });
});
