/**
 * Manifest: Application Suite
 */

define(function(require){
  return {
    name: 'application-suite'

  , path: './views/app'

  , baseUrl: ''

  // , apps: {
  //     'landing-site':   'defer'
  //   , 'consumer-panel': 'defer'
  //   , 'suite-nav':       null
  //   }

  , apps: [
      'defer!landing-site'
    // , 'defer!consumer-panel'
    // , 'suite-nav'
    ]

  , prerequisites: []
  };
});
