define(function(require){
  var
    rad       = require('radagast')
  , domready  = require('domReady')

  , apps      = require('./apps')

  , appSuite
  ;

  // Register apps
  for (var i = apps.length - 1; i >= 0; i--){
    rad.apps.add(apps[i]);
  };

  apps.get('application-suite', function(Suite){
    appSuite = new Suite();

    appSuite.initApps(function(){
      rad.utils.history.start();

      domready(function(){
        utils.rad.dom(document.body).append(appSuite.$el);
      });
    });
  });
});
