define(function(require){
  return {
    utils  : require('./src/utils')
  , apps   : require('./src/apps-handler')
  , App    : require('./src/app')
  , Suite  : require('./src/suite')
  , logger : require('./src/logger')
  };
});