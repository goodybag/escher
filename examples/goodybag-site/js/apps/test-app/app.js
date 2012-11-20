/**
 * Manifest: Test App
 */

define(function(require){
  return {
    name: 'test-app'

  , path: './views/app'

  , router: require('./router')

  , baseUrl: 'test'

  , apps: []

  , prerequisites: []
  };
});