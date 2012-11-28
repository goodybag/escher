define(function(require){
  var
    pubsub = require('./pubsub')
  , logger = require('./logger')


  , logger = new logger("CSS")
  , els    = {}

  , createStyle = function(id, declarations){
      var style       = document.createElement('style');
      style.type      = "text/css";
      style.id        = id;
      style.innerHTML = declarations;
      return style;
    }

  , module = {
      get: function(file){
        return els[file];
      }
    , remove: function(file){
        // Unload from require ... figure that out
        document.head.removeChild(module.get(file));
      }
    }
  ;

  pubsub.subscribe('app.instantiate', function(msg, app){
    if (app._package.css){
      logger.info("Parsing application CSS");

      var paths = app._package.css, el, ids = [];
      for (var i = paths.length - 1; i >= 0; i--){
        paths[i] = 'text!' + (ids[i] = paths[i].replace('./', app._package.appDirectory + '/')) + '.css'
      }

      require(paths, function(){
        for (var i = ids.length - 1, style; i >= 0; i--) {
          style = createStyle(ids[i], arguments[i]);
          document.head.appendChild(style);
          els[ids[i]] = style;
        };
      });
    }
  });

  return module;
});