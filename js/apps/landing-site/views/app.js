define(function(require){
  var
    utils     = require('utils')
  , logger    = require('logger')
  , App       = require('views/app')
  ;

  return App.extend({
    Apps: {
    //   'activity-stream': {
    //     baseUrl: 'activity'
    //   , $el: '> .stream'
    //   , onReady: function(app){
    //       /* ... */
    //     }
    //   }

    // , 'business-listing': {
    //     baseUrl: 'businesses'
    //   , onReady: function(app){
    //       /* ... */
    //     }
    //   }
    }

  , dependencies: {
      template: 'hbt!./templates/app'
    , children: {
        Nav:    './nav'
      , Footer: './footer'
      }
    , pages: {
        landing:      './landing-page'
      , charities:    './charities-page'
      , legal:        './legal-page'
      , privacy:      './privacy-page'
      , businesses:   './businesses-page'
      }
    }

  , initialize: function(options){
      this.baseUrl = options.baseUrl;
      this.initial = 'landing';

      this.loadDependencies(options.onReady);

      return this;
    }

  , render: function(){
      this.children.nav.render();
      this.children.footer.render();

      this.apps['business-listing'].render();
      this.$el.append(this.apps['business-listing'].$el);
      if (this.current) this.current.render();
      return this;
    }

  , logoClick: function(){
      logger.info("[Landing Site] - logo click");
    }

  , openPage: function(pageName){
      if (pageName === this.current) return this;
      // Special stuff for landing page
      if (pageName === "landing"){
        utils.dom(document.body).addClass('index');
        this.children.footer.show();
        this.children.footer.exitSlideMode();
      }else{
        utils.dom(document.body).removeClass('index');
        this.children.footer.enterSlideMode();
      }

      return App.prototype.openPage.call(this, pageName);
    }
  });
});