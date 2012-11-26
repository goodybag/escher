/**
 * Logger - Placeholder functions for now
 */

define(function(require){
  var
    utils   = require('./utils')
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

  , Logger = function(section){
      this.section = section;
    }

  , logger
  ;

  Logger.prototype = {
    log: function(type, args){
      var output = (this.section ? "[{section}] - " : "");
      // ensure array
      args = Array.prototype.slice.call(interpolate.apply({}, args), 0);
      args.unshift(
        utils.interpolate(output, {
          date: new Date().toString()
        , section: this.section
        })
      );
      console[type].apply(console, args);
    }

  , info: function(){
      this.log.call(this, 'info', arguments);
    }

  , debug: function(){
      this.log.call(this, 'debug', arguments);
    }

  , warn: function(){
      this.log.call(this, 'warn', arguments);
    }

  , error: function(){
      this.log.call(this, 'error', arguments);
    }
  };

  // Make logger statically available
  logger = new Logger();
  for (var method in Logger.prototype){
    Logger[method] = logger[method];
  }

  return Logger;
});
