define(function(require){
  var
    utils            = require('utils')
  , template         = require('hbt!./../html/businesses-page')
  , businessTemplate = require('hbt!./../html/business')
  , Businesses       = require('./../collections/businesses')
  ;

  return utils.View.extend({
    businesses: null
  , businessesFilter: null

  , events:{
      'keyup #business-name' : 'updateBusinessFilter'
    }

  , initialize: function(){
      this.businesses = new Businesses();
      this.businesses.on('reset', this.renderBusinesses, this);
      this.businesses.fetch();

      this.render();
    }

  , render: function() {
      this.$el.html(template());
      
      this.$businessList = this.$('#business-list');
      this.$businessName = this.$('#business-name');

      this.renderBusinesses();
    }

  , renderBusinesses : function() {
      var businesses = this.businesses;

      if (this.businessesFilter) {
        businesses = businesses.search(this.businessesFilter);
      }

      var html = businesses.map(function(b) {
        return businessTemplate({
          name      : b.get('publicName')
        , thumb_url : b.get('media') ? b.get('media').thumb : ''
        });
      }).join('');

      this.$businessList.html(html);
  }

  , updateBusinessFilter: function() {
      this.businessesFilter = this.$businessName.val();
      this.renderBusinesses();
    }
  });
});
