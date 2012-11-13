define(function(require){
  var
    utils     = require('utils')
  , Page      = require('views/page')
  , template  = require('hbt!./../templates/landing-page')
  ;

  return Page.extend({
    template: template
  });
});
