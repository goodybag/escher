/**
 * Manifest: Test App
 */

define(function(require){
  return {
    name: 'test-app'

  , path: './views/app'

  , routes: {
      "":                   "landing"
    , "charities":          "charities"
    , "businesses":         "businesses"
  }

  , baseUrl: 'test'

  // , css: [
  //     './css/layout'
  //   , './css/media-queries'
  //   ]

  , apps: []

  , prerequisites: []
  };
});
