require.config({
  hbt: {
    extension: 'html'
  }
});

define(function(require){
  var
    domready    = require('domReady')
  , utils       = require('utils')
  , User        = require('models/user')
  , suite       = require('suite')
  , appsHandler = require('apps-handler')

  // , router    = new Router()
  , apps        = require('apps')
  , user        = new User()
  ;

  // Add applications to registry
  for (var i = apps.length - 1; i >= 0; i--) {
    appsHandler.add(apps[i]);
  };

  appsHandler.get('suite', function())

  // Setup a base router
  new utils.Router({
    routes: { '': 'redirect' }
  , redirect: function(){
      utils.Backbone.history.navigate('site');
    }
  });
  utils.Backbone.history.start({ root: '/' });

  suite.render();

  // Initially throw up suite loader

  // Switch apps
  user.on('auth', function(){
    if (suite) suite.openApp('consumer-panel');
  });

  user.on('de-auth', function(){
    if (suite) suite.openApp('landing-site');
  });

  user.session();

  domready(function(){
    utils.dom(document.body).html(suite.el);
  });

  return suite;
});
