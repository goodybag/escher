/**
 * Manifest: Test App
 */

define(function(require){
  return {
    name: 'test-app'

  , path: './views/app'

  , router: require('./router')

  , baseUrl: 'test'

  // , css: [
  //     './css/layout'
  //   , './css/media-queries'
  //   ]

  , apps: []

  , prerequisites: []
  };
});