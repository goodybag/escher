require.config({
  hbt: {
    extension: 'html'
  }
});

define(function(require){
  var
    domready  = require('domReady')
  , util      = require('utils')
  , User      = require('models/user')
  , Suite     = require('views/suite')
  , apps      = require('apps')

  , app = {
      view: new Suite({
        apps: apps
      })
    , user: new User()
    }
  ;

  app.view.

  // Switch apps
  app.user.on('authenticate', function(){

  });

  app.user.session();

  app.view.render();

  domready(function(){
    utils.dom(body).html(app.view.el);
  });

  return app;
});
