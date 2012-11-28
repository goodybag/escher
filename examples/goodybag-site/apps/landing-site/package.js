/**
 * Manifest: Landing Site
 */

define(function(require){
  return {
    name: 'landing-site'

  , path: './views/app'
  , routerPath: './router'

  , routes: {
      "":                   "landing"
    , "charities":          "charities"
    , "businesses":         "businesses"
  }

  , baseUrl: 'landing'

  , apps: [
      'test-app'
    ]

  , prerequisites: []
  };
});
