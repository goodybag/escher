define(function(require){
  var
    rad             = require('radagast')
  , utils           = require('utils')
  , Suite = rad.Suite

  , NavView         = require('./nav')
  , FooterView      = require('./footer')
  , template        = require('hbt!./../html/suite')
  ;

  return Suite.extend({
    className: 'applications'

  , id: 'application-suite'

  , regions: {
      '.pages': [
        'landing-site'
      , 'consumer-panel'
      , 'businesses'
      ]
    , '#nav'    : new NavView()
    , '#footer' : new FooterView()
    }

  , initialize: function(){
    }

  , render: function(){
      this.$el.html(template());
      this.renderViewRegions();
    }
  });
});