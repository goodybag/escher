/**
 * Router: Landing Site
 */

define(function(require){
  return {
    initialize: function(options){
      // An instance the application will be passed to the route
      this.app = options.app;
    }

  , index: function(){
      console.log('index');
    }

  , charities: function(){
      console.log('charities');
    }

  , businesses: function(){
      console.log('businesses');
    }
  };
});
