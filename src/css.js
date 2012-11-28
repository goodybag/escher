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
      var css = app._package.css, el ;
      for (var i = css.length - 1; i >= 0; i--){
        css[i] = 'text!' + css[i].replace('./', app._package.appDirectory + '/') + '.css'
      }

      logger.info(css);

      require(css, function(){
        for (var i = css.length - 1, style; i >= 0; i--) {
          style = createStyle(css[i], arguments[i]);
          document.head.appendChild(style);
          els[css[i]] = style;
        };
      });
    }
  });

  return module;
});