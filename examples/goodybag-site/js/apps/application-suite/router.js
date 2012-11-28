/**
 * Router: Application Suite
 */

define(function(require){
  return {
    index: function(){
      console.log("index");
      window.location.hash = "/landing/";
    }
  };
});
