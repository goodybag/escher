require.config({
  hbt: {
    extension: 'html'
  }
});

define(function(require){
  var
    rad       = require('radagast')
  , apps      = rad.apps
  , utils     = rad.utils
  , domready  = require('domReady')

  , appsList  = require('./apps')

  , appSuite
  ;

  // Register apps
  apps.add(appsList, function(){
    // Get the application-suite class
    apps.get('application-suite', function(error, Suite){
      if (error) throw error;

      // Kick off our application
      appSuite = new Suite();
      appSuite.render();

      // Initialize all of the suites apps
      appSuite.initApps(function(){

        // Start backbone history since everything is ready

        // Put our suite into the dom when we can - which we probably can :)
        domready(function(){
          utils.dom(document.body).append(appSuite.$el);

          utils.Backbone.history.start();
        });
      });
    });
  });

  return function(){
    return appSuite;
  };
});