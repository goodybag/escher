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
    , "privacy":            "privacy"
    , "legal":              "legal"
  }

  , baseUrl: ''

  , apps: []

  , prerequisites: []
  };
});
