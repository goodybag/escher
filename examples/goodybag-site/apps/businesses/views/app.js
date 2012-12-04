define(function(require){
  var
    rad              = require('radagast')
    utils            = require('utils')
  , Businesses       = require('./../collections/businesses')
  ;                    require('fancybox');

  var templates = {
    page           : require('hbt!./../html/businesses-page')
  , business       : require('hbt!./../html/business')
  , detailModal    : require('hbt!./../html/modals/business-details')
  , requestedModal : require('hbt!./../html/modals/business-requested')
  };

  return rad.App.extend({
    businesses: null
  , businessesFilter: null

  , events:{
      'keyup #business-name'   : 'updateBusinessFilter'
    , 'click .items-list > li' : 'openBusinessDetails'
    , 'submit .request'        : 'submitBusinessRequest'
    }

  , initialize: function(){
      this.businesses = new Businesses();
      this.businesses.on('reset', this.renderBusinesses, this);
      this.businesses.fetch();

      this.render();
    }

  , render: function() {
      this.$el.html(templates.page());
      
      this.$businessList = this.$('.items-list');
      this.$businessName = this.$('#business-name');
      this.$requestedBusinessName = this.$('#business-name2');

      this.renderBusinesses();
    }

  , renderBusinesses: function() {
      var businesses = this.businesses;

      if (this.businessesFilter) {
        businesses = businesses.search(this.businessesFilter);
      }

      var html = businesses.map(function(b) {
        return templates.business({
          id        : b.id
        , name      : b.get('publicName')
        , thumb_url : b.get('media') ? b.get('media').thumb : ''
        });
      }).join('');

      this.$businessList.html(html);
  }

  , updateBusinessFilter: function() {
      this.businessesFilter = this.$businessName.val();
      this.renderBusinesses();
    }

  , openBusinessDetails: function(e) {
      // get biz
      var b = this.businesses.get($(e.currentTarget).data('id'));
      if (!b) { return false; }

      // build context
      var locations_count = b.get('locations').length;
      var context = {
        name              : b.get('publicName')
      , locations_summary : locations_count + ' Location' + ((locations_count > 1) ? 's' : '')
      , locations         : b.get('locations')
      , thumb             : b.get('media') ? b.get('media').thumb : ''
      , tags              : b.get('type')
      , website           : b.get('url')
      };

      // open modal
      this.openModal(templates.detailModal(context));
      return false;
    }

  , submitBusinessRequest: function() {
      // grab value and clear
      var data = { businessName:this.$requestedBusinessName.val() };
      this.$requestedBusinessName.val('');

      // submit to the service
      $.post("http://www.goodybag.com/api/consumers/businessRequests", data);

      // thank you, come again
      this.openModal(templates.requestedModal());

      return false;
  }

  , openModal: function(html) {
      // :TODO: move to a util namespace?
      $.fancybox.open(html, {
          autoWidth: true
        , autoHeight: true
        , padding: 0
        , margin: 0
        , closeBtn: false
      });
      $('.fancybox-inner .close').click(function() { $.fancybox.close(); return false; });
  }
  });
});
