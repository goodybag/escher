define(function(require){
  var pubsub = require('escher/src/pubsub');

  var Escher = {
    // imported APIs
    utils       : require('escher/src/utils')
  , apps        : require('escher/src/apps-handler')
  , App         : require('escher/src/app')
  , Suite       : require('escher/src/suite')
  , logger      : require('escher/src/logger')
  , config      : require('escher/src/config')
  , css         : require('escher/src/css')
  , publish     : pubsub.publish
  , subscribe   : pubsub.subscribe
  , unsubscribe : pubsub.unsubscribe

    // methods
  , start       : start

    // attributes
  , mainApp     : null
  };

  function start(app_name, cb) {
    cb = cb || fallback_cb;

    // register apps
    Escher.apps.add(Escher.config.apps, function(){
      Escher.apps.get(app_name, function(error, AppCtor){
        if (error) return cb(error);
        // load the main application
        Escher.mainApp = new AppCtor({ el:Escher.config.el });
        Escher.mainApp.render();
        Escher.mainApp.initApps(function(){

          Escher.utils.domready(function(){

            // inject the suite into the dom, if needed
            if (typeof Escher.config.el === 'undefined') {
              var $el = Escher.utils.dom(document.body);
              $el.append(Escher.mainApp.$el);
            }

            // start listening to navigation changes
            Escher.utils.Backbone.history.start();

            // away we go
            cb(undefined, Escher.mainApp);
          });
        });
      });
    });
  }

  function fallback_cb(err) {
    if (err) throw err;
  }

  return Escher;
});
