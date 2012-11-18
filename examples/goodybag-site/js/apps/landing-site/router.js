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
      this.app.openPage('landing');
    }

  , charities: function(){
      this.app.openPage('charities');
    }

  , businesses: function(){
      this.app.openPage('businesses');
    }
  };
});