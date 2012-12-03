define(function(require){
  var
    utils    = require('utils')
  , Business = require('./../models/business')
  ;

  return utils.Collection.extend({
    model: Business
  , url: "http://www.goodybag.com/api/consumers/participatingBusinesses"

  , parse: function(resp, xhr) {
    return resp && resp.data;
  }

  , comparator: function(business) {
    return business.get('publicName');
  }

  , search: function(input){
      input = input.toLowerCase();
      return this.filter(function(model){
        return model.get('publicName').toLowerCase().indexOf(input) > -1;
      });
    }
  });
});
