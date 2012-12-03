define(function(require){
   var
    // 3rd Party Dependencies
    $         = require('jquery')
  , _         = require('lodash')
  , domready  = require('domReady')
    // tell requirejs that backbone is a dep, but use the global one
    // (backbone's shim, when compiled, provides a bad value to require
    //  so we're better off using the global)
  , bb        = require('backbone')

    // Module Variables
  , utils     = {}
  ;

  utils.noop = function(){};

  utils.dom = $;

  utils.Backbone   = Backbone;
  utils.Events     = Backbone.Events;
  utils.Router     = Backbone.Router;
  utils.SubRouter  = Backbone.SubRoute;
  utils.Model      = Backbone.Model;
  utils.View       = Backbone.View;
  utils.Collection = Backbone.Collection;
  utils.History    = Backbone.History;

  utils = _.extend(utils, _);

  utils.domready = domready;

  /**
   * Ol' boy crockfords String interpolation
   * @param  {String} str    The string you want to interpolate with
   * @param  {Object} values The object mapping the keys in the string to values
   * @return {String}        The result
   * @example
   *   "Hello, my name is {name}", { name: "Stacy" } => "Hello, my name is Stacy."
   */
  utils.interpolate = function(str, values){
    return str.replace(/{([^{}]*)}/g, function(a, b){
      var r = values[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  };

  return utils;
});
