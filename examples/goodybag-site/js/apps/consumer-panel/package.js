/**
 * Manifest: Consumer Panel
 */

define(function(require){
  return {
    name: 'consumer-panel'

  , path: './views/app'

  , routes:{
      "":                   "index"
    , "charities":          "charities"
    , "businesses":         "businesses"
  }

  , baseUrl: 'panel'

  , apps: []

  , prerequisites: []
  };
});
