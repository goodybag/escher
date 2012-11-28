define(function(require){
  var
    rad   = require('radagast')
  , utils = require('utils')
  ;

  return rad.App.extend({
    initialize: function(options){
      this.options = utils.defaults(options, {

      });

      this.regions = { '': this.options.pages };
      this.
    }
  });
});