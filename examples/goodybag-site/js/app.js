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
      'apps/application-suite/app'
    , 'apps/landing-site/app'
    , 'apps/consumer-panel/app'
    , 'apps/test-app/app'
    ]
  });

  rad.start('application-suite', function(err, app) {
    if (err) return console.log(err);
  });
});
