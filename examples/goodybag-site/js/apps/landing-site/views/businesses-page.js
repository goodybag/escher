define(function(require){
  var
    utils       = require('utils')
  , api         = require('api')
  , Page        = require('views/page')
  , template    = require('hbt!./../templates/businesses-page')
  ;

  return Page.extend({
    template: template

  // , initialize: function(){
  //     // var $this = this;
  //     // this.businesses = [];
  //     // api.businesses.get({ skip: 0, limit: 999 }, function(error, data){
  //     //   if (error) return;
  //     //   $this.businesses = data;
  //     // });
  //   }

  // , render: function(){

  //   }
  });
});
