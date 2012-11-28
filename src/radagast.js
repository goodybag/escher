define(function(require){
  var pubsub = require('./src/pubsub');

  var Radagast = {
    // imported APIs
    utils       : require('./src/utils')
  , apps        : require('./src/apps-handler')
  , App         : require('./src/app')
  , Suite       : require('./src/suite')
  , logger      : require('./src/logger')
  , publish     : pubsub.publish
  , subscribe   : pubsub.subscribe
  , unsubscribe : pubsub.unsubscribe
  , config      : require('./src/config')

    // methods
  , start       : start

    // attributes
  , mainApp     : null
  };

  function start(app_name, cb) {
    cb = cb || fallback_cb;

    // register apps
    Radagast.apps.add(Radagast.config.apps, function(){
      Radagast.apps.get(app_name, function(error, AppCtor){
        if (error) return cb(error);
        // load the main application
        Radagast.mainApp = new AppCtor({ el:Radagast.config.el });
        Radagast.mainApp.render();
        Radagast.mainApp.initApps(function(){

          Radagast.utils.domready(function(){

            // inject the suite into the dom, if needed
            if (typeof Radagast.config.el === 'undefined') {
              var $el = Radagast.utils.dom(document.body);
              $el.append(Radagast.mainApp.$el);
            }

            // start listening to navigation changes
            Radagast.utils.Backbone.history.start();

            // away we go
            cb(undefined, Radagast.mainApp);
          });
        });
      });
    });
  }

  function fallback_cb(err) {
    if (err) throw err;
  }

  return Radagast;
});
