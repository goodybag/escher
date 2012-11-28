/**
 * Router: Landing Site
 */

define(function(require){
  return {
    initialize: function(options){
      // An instance the application will be passed to the route
      this.app = options.app;
    }

  , routes: {
      "":                   "landing"
    , "charities":          "charities"
    , "businesses":         "businesses"
    }

  , landing: function(){
      console.log("Landing");
    }

  , charities: function(){
      console.log('charities');
    }

  , businesses: function(){
      console.log('businesses');
    }
  };
});