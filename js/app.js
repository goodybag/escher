require.config({
  hbt: {
    extension: 'html'
  }
});

define(function(require){
  var
    domread = require('domReady')
  , util    = require('utils')
  , Views   = require('views')

  , app = {
      view: new Views.App()
    }
  ;

  app.view.render();

  domready(function(){
    utils.dom(body).html(app.view.el);
  });

  return;
});
