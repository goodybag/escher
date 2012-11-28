require.config({
  hbt: {
    extension: 'html'
  }
});

define(function(require){
  var
    rad = require('radagast')
  ;

  rad.config({
    apps:[
      'apps/application-suite'
    , 'apps/landing-site'
    , 'apps/consumer-panel'
    , 'apps/test-app'
    ]
  });

  rad.start('application-suite', function(err, app) {
    if (err) return rad.logger.error(err);
  });
});
