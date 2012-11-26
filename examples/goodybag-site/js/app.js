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

  // Test pubsub
  rad.subscribe('debug', function(msg, data) {
    console.log('received pubsub message over \''+msg+'\'', data);
  });

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

        // Put our suite into the dom when we can - which we probably can :)
        domready(function(){
          console.log("Domready");
          utils.dom(document.body).append(appSuite.$el);

          appSuite.open('consumer-panel', function(app){
            rad.publish('debug', {hello:'world'});
            utils.Backbone.history.start();
          });
        });
      });
    });
  });

  return function(){
    return appSuite;
  };
});
