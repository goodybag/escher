/**
 * Mediator
 * Just a common namespace for mediating application events
 */

define(function(require){
  var
    // 3rd Party Dependencies
    Backbone = require('backbone')

    // App Dependencies
    utils    = require('utils')

    // Module Variables
  , mediator = utils.extend({}, Backbone.Events)
  ;

  return;
});
