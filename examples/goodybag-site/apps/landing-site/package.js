/**
 * Manifest: Landing Site
 */

define(function(require){
  return {
    name:     'landing-site'

  , path:     './views/app'

  , router:   require('./router')

  , baseUrl:  'landing'

  , apps: []

  , css: [
      './css/jquery.fancybox'
    , './css/video-js.min'
    ]

  , prerequisites: []
  };
});