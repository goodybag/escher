define(function(require){
  var
    InsideAppView   = require('views/inside')
  , OutsideAppView  = require('views/outside')
  ;

  return [
    {
      name: 'inside'
    , view: InsideAppView
    }

  , {
      name: 'outside'
    , view: OutsideAppView
    }
  ];
});
