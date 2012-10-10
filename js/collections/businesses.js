define(function(require){
  var
    utils   = require('utils')
  , config  = require('config')
  ;

  return new utils.Collection.extend({
    url: config.apiUrl + '/businesses'
  });
});
