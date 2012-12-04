define(function(require){
  var
    rad             = require('radagast')
  , utils           = require('utils')

    // Sub-views
  , NavView         = require('./nav')
  , FooterView      = require('./footer')
  , LandingView     = require('./landing-page')
  , CharitiesView   = require('./charities-page')
  , LegalView       = require('./legal-page')
  , PrivacyView     = require('./privacy-page')

  , template        = require('hbt!./../html/app')

  , logger          = new rad.logger("Landing Site")
  ;

  return rad.App.extend({
    regions: {
      '#nav' :  new NavView()
    , '#footer'   :  new FooterView()
    }

  , pages: {
      'landing'    : new LandingView()
    , 'charities'  : new CharitiesView()
    , 'privacy'    : new PrivacyView()
    , 'legal'      : new LegalView()
    }

  , initialize: function(){
      rad.subscribe('landing.changePageRequest', utils.bind(this.onChangePageRequest, this));
    }

  , render: function(){
      this.$el.html(template());

      var $pages = this.$el.find('.pages'), page;

      for (var key in this.pages){
        page = this.pages[key];
        page.render();
        page.$el.css('display', 'none');
        $pages.append(page.$el);
      }
    }

  , onChangePageRequest: function(channel, page){
      return this.changePage(page);
    }

  , changePage: function(pageName){
      if (!this.pages[pageName]) return logger.error("Page does not exist: ", pageName), this;

      if (this.currentPage === pageName) return logger.warn("Already on this page: ", pageName), this;

      logger.info("Changing to page: ", pageName);

      rad.publish('landing.changePage.' + pageName);

      if (pageName === "landing"){
        utils.dom(document.body).addClass('index');

        rad.publish('landing.footer.show');
        rad.publish('landing.footer.exitSlideMode');
      }else{
        utils.dom(document.body).removeClass('index');
        rad.publish('landing.footer.enterSlideMode');
      }

      if (this.currentPage) this.pages[this.currentPage].$el.css('display', 'none');
      this.pages[this.currentPage = pageName].$el.css('display', 'block');
    }
  });
});