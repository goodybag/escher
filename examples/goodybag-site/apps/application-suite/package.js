/**
 * Manifest: Application Suite
 */

define(function(require){
  return {
    name: 'application-suite'

  , path: './views/app'

  , router: {
      routes: {
        '': 'index'
      }
    , index: function(){
        console.log("index");
        window.location.hash = "/landing/";
      }
    }

  , baseUrl: ''

  , apps: [
      'defer!landing-site'
    , 'defer!consumer-panel'
    // , 'suite-nav'
    ]

  , prerequisites: []
  };
});
