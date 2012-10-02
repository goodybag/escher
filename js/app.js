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

  suite.render();

  // Initially throw up suite loader

  // Switch apps
  user.on('auth', function(){
    if (suite) suite.openApp('consumer-panel');
  });

  user.on('de-auth', function(){
    console.log("opening landing site");
    if (suite) suite.openApp('landing-site');
  });

  user.session();

  domready(function(){
    utils.dom(document.body).html(suite.el);
  });

  return suite;
});
