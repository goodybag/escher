define(function(require){
  var
    rad         = require('radagast')
  , utils       = require('utils')

  , NavView     = require('./nav')
  , FooterView  = require('./footer')
  , LandingView = require('./landing-page')

  , template    = require('hbt!./../html/app')

  , logger      = new rad.logger("Landing Site")
  ;

  return rad.App.extend({
    regions: {
      '.main-nav' :  new NavView()
    , '.footer'   :  new FooterView()
    }

  , pages: {
      'landing': new LandingView()
    }

  , initialize: function(){
      var this_ = this, bound = function(fn){
        return function(){ fn.apply(this_, arguments); }
      };
      rad.subscribe('landing.changePageRequest', bound(this.onChangePageRequest));
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

      if (this.currentPage) this.pages[this.currentPage].$el.css('display', 'none');
      this.pages[this.currentPage = pageName].$el.css('display', 'block');
    }
  });
});