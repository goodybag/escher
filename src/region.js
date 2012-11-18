define(function(require){
  var utils = require('./utils');

  var Region = function(parent, selector, application){
    if (utils.isArray(application)) this.isMultiApp = true;
    this.parent = parent;
    this.selector = selector;
    this.application = application;
  };

  Region.prototype = {
    open: function(app){
      // Didn't specify an app-name
      // Must not be a multiApp region or they just want to
      // Open whatever is in the region if it's closed
      if (!app){
        if (!this.isMultiApp){
          // If we've already have a reference to the app instance
          if (this.parent.appInstantiated(this.application)){
            this.
          }
        }else{

        }

      }
    }
  };

  return Region;
});