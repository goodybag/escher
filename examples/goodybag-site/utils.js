define(function(require){
  var
    utils = require('radagast').utils

  , async = require('async')
  ;

  utils.extend(utils, async);

  return utils;
});