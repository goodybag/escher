define(function(require){
  var
    rad   = require('radagast')
  , utils = rad.utils
  , Suite = rad.Suite
  ;

  return Suite.extend({
    className: 'applications'

  , id: 'application-suite'

  , regions: {
      '': [
        'landing-site'
      , 'consumer-panel'
      ]
    }
  });
});