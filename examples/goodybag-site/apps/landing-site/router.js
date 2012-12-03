/**
 * Router: Landing Site
 */

define(function(require){
  var rad = require('radagast');

  return {
    initialize: function(options){
      // An instance the application will be passed to the route
      this.app = options.app;
    }

  , landing: function(){
      rad.publish('landing.changePageRequest', 'landing');
    }

  , charities: function(){
      rad.publish('landing.changePageRequest', 'charities');
    }

  , businesses: function(){
      rad.publish('landing.changePageRequest', 'businesses');
    }

  , privacy: function(){
      rad.publish('landing.changePageRequest', 'privacy');
    }

  , legal: function(){
      rad.publish('landing.changePageRequest', 'legal');
    }
  };
});
