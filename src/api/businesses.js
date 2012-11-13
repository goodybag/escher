define(function(require){
  var
    // 3rd Party Dependencies

    // App Dependencies
    utils     = require('utils')
  , config    = require('config')
  , schemas   = require('schemas/index')
  , logger    = require('logger')

    // Module Variables
  , businesses = {}
  ;

  businesses.find = function(options, callback){
    if (typeof options === "function"){
      callback = options;
      options = {};
    }
    options = utils.paramParser(options);
    utils.get('businesses' + options, callback);
  };

  businesses.findOne = function(id, callback){
    if (!id) throw new Error("id is a required argument");
    if (typeof id === "function") return id({ message: "id is not defined", type: "validation" });
    utils.get('businesses/' + id, callback);
  };

  businesses.goodies = function(id, callback){
    if (!id) throw new Error("id is a required argument");
    if (typeof id === "function") return id({ message: "id is not defined", type: "validation" });
    utils.get('businesses/' + id + '/goodies', callback);
  }

  return businesses;
});
