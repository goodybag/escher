/**
 * Logger - Placeholder functions for now
 */

define(function(require){
  var
    // 3rd Party Dependencies

    // App Dependencies

    // Module Variables
    logger = {}
  ;

  logger.info = function(){
    console.log.apply(console, arguments);
  };

  logger.debug = function(){
    console.debug.apply(console, arguments);
  };

  logger.warn = function(){
    console.warn.apply(console, arguments);
  };

  logger.error = function(){
    console.error.apply(console, arguments);
  };

  return logger;
});
