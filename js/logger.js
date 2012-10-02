/**
 * Logger - Placeholder functions for now
 */

define(function(require){
  var
    utils   = require('utils')
  , logger  = {}
  , isInter = /{([^{}]*)}/

  , interpolate = function(){
      var args = arguments;
      // Check if we should interpolate string
      if (typeof args["0"] === "string" && typeof args["1"] === "object" && isInter.test(args["0"])){
        args = [utils.interpolate(args["0"], args["1"])];
        if (arguments.length > 2) args = args.concat(Array.prototype.slice.call(arguments, 2));
      }
      return args;
    }
  ;

  logger.info = function(){
    console.log.apply(console, interpolate.apply({}, arguments));
  };

  logger.debug = function(){
    console.debug.apply(console, interpolate.apply({}, arguments));
  };

  logger.warn = function(){
    console.warn.apply(console, interpolate.apply({}, arguments));
  };

  logger.error = function(){
    console.error.apply(console, interpolate.apply({}, arguments));
  };

  return logger;
});
