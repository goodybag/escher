/**
 * Manifest: Application Suite
 */

define(function(require){
  return {
    name: 'application-suite'

  , path: './views/app'

  , baseUrl: ''

  , apps: [
      'defer!landing-site'
    , 'defer!consumer-panel'
    // , 'suite-nav'
    ]

  , prerequisites: []
  };
});
