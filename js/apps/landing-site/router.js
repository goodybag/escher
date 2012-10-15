define(function(require){
  var
    utils = require('utils')
  ;

  return utils.Router.extend({
    initialize: function(options){
      this.app = options.app;
    }

  , routes: {
      "":                   "landing"
    , "charities":          "charities"
    , "businesses":         "businesses"
    , "legal":              "legal"
    , "privacy":            "privacy"
    }

  , landing: function(){
      // this.app.openPage('landing');
      console.log("lkajsdflaksjdf laksdjflasdkfjaksdflkajsjfjasdlfasdjflkasdkfj");
    }

  , charities: function(){
      // this.app.openPage('landing');
      console.log("WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    }

  , businesses: function(){
      // this.app.openPage('landing');
      console.log("WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    }
  });
});