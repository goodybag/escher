define(function(require){
  var
    pubsub = require('./src/pubsub')
  , utils = require('./src/utils')
  , domready = require('domReady')
  ;

  var Radagast = {
    // imported APIs
    utils       : utils
  , apps        : require('./src/apps-handler')
  , App         : require('./src/app')
  , Suite       : require('./src/suite')
  , logger      : require('./src/logger')
  , publish     : pubsub.publish
  , subscribe   : pubsub.subscribe
  , unsubscribe : pubsub.unsubscribe

    // methods
  , config      : config
  , start       : start

    // attributes
  , mainApp     : null
  };

  function config(options) {
    var newconfig = utils.extend(Radagast.config, options);
    // store configuration in this function object
    Radagast.config = utils.defaults(newconfig, {
        apps  : []
      , el    : undefined
      , ready : utils.noop
      }
    );
    // :NOTE: defaults() are run on the entire config -- not just the options passed in
    // if defaults() were run on the options parameter, then config() could not be called twice
    // (the defaults would overwrite existing config)
  }

  function start(app_name, cb) {
    cb = cb || fallback_cb;

    // register apps
    Radagast.apps.add(Radagast.config.apps, function(){
      console.log("Apps added!");

      Radagast.apps.get(app_name, function(error, AppCtor){
        if (error) return cb(error);
        console.log("Main app acquired");

        // load the main application
        Radagast.mainApp = new AppCtor({ el:Radagast.config.el });
        Radagast.mainApp.initApps(function(){
          console.log("Map app's apps initialized");

          domready(function(){
            console.log("Domready");

            // inject the suite into the dom, if needed
            if (typeof Radagast.config.el === 'undefined') {
              var $el = utils.dom(document.body);
              $el.append(Radagast.mainApp.$el);
            }

            // start listening to navigation changes
            utils.Backbone.history.start();

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
