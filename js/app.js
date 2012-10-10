require.config({
  hbt: {
    extension: 'html'
  }
});

define(function(require){
  var
    domready  = require('domReady')
  , utils     = require('utils')
  , User      = require('models/user')
  // , Router    = require('router')
  , suite     = require('suite')

  // , router    = new Router()
  , user      = new User()
  ;

  new utils.Router({
    routes: { '': 'redirect' }
  , redirect: function(){
      console.log('poop');
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
