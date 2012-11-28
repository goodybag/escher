define(function(require){
  var
    utils   = require('utils')
  , config  = require('config')
  ;

  return new utils.Collection.extend({
    url: config.apiUrl + "businesses"

  , search: function(input){
      return this.filter(function(model){
        return model.get('name').indexOf(input) > -1;
      });
    }
  });
});
