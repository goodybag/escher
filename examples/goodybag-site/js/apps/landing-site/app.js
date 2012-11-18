/**
 * Manifest: Landing Site
 */

define(function(require){
  return {
    name: 'application-suite'

  , path: './views/app'

  , router: require('./router')

  , baseUrl: 'landing'

  , apps: []

  , prerequisites: []
  };
});