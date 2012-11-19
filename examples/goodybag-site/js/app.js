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
    console.log("Apps added!");
    // Get the application-suite class
    apps.get('application-suite', function(error, Suite){
      if (error) throw error;
      console.log("Applicatin-suite acquired");

      // Kick off our application
      appSuite = new Suite();

      // Initialize all of the suites apps
      appSuite.initApps(function(){
        console.log("Applicatin-suite apps initialized");

        // Start backbone history since everything is ready
        utils.Backbone.history.start();

        // Put our suite into the dom when we can - which we probably can :)
        domready(function(){
          console.log("Domready");
          utils.dom(document.body).append(appSuite.$el);
        });
      });
    });
  });
});