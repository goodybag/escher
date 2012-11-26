define(function(require){
  var pubsub = require('./src/pubsub');
  return {
    utils       : require('./src/utils')
  , apps        : require('./src/apps-handler')
  , App         : require('./src/app')
  , Suite       : require('./src/suite')
  , logger      : require('./src/logger')

  , publish     : pubsub.publish
  , subscribe   : pubsub.subscribe
  , unsubscribe : pubsub.unsubscribe
  };
});
