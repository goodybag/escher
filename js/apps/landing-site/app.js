define(function(require){
  var
    utils     = require('utils')
  , logger    = require('logger')
  , App       = require('views/app')
  , Router    = require('./router')
  , template  = require('hbt!./templates/app')

  , Views = {
      Nav:    require('./views/nav')
    , Footer: require('./views/footer')
    }

  // , Pages = {
  //     Landing:      require('./views/landing-page')
  //   , Charities:    require('./views/charities-page')
  //   , Legal:        require('./views/legal-page')
  //   , Privacy:      require('./views/privacy-page')
  //   , Businesses:   require('./views/businesses-page')
  //   }
  ;

  return App.extend({
    initialize: function(options){
      this.baseUrl = options.baseUrl;

      this.router = new Router(this.baseUrl, {
        app: this
      , createTrailingSlashRoutes: true
      });

      this.template = template;

      // this.pages = {
      //   'landing':      Pages.Landing
      // , 'charities':    Pages.Charities
      // , 'legal':        Pages.Legal
      // , 'privacy':      Pages.Privacy
      // , 'businesses':   Pages.Businesses
      // };

      // These pages only load if we create an instance of the app
      this.pages = {
        landing:      require('./views/landing-page')
      , charities:    require('./views/charities-page')
      , legal:        require('./views/legal-page')
      , privacy:      require('./views/privacy-page')
      , businesses:   require('./views/businesses-page')
      };

      this.initial = 'landing';

      this.$el.html(this.template());

      this.children = {
        nav:    new Views.Nav({ el: this.$el.find('.main-nav') })
      , footer: new Views.Footer({ el: this.$el.find('.footer') })
      };

      // Setup navigation actions
      this.children.nav.on('logo:click', utils.bind(this.logoClick, this));

      return this;
    }

  , render: function(){
      this.children.nav.render();
      this.children.footer.render();
      if (this.current) this.current.render();
      return this;
    }

  , logoClick: function(){
      logger.info("[Landing Site] - logo click");
    }

  , openPage: function(pageName){
      // Special stuff for landing page
      if (pageName === "landing"){
        utils.dom(document.body).addClass('index');
        this.children.footer.exitSlideMode();
      }else{
        utils.dom(document.body).removeClass('index');
        this.children.footer.enterSlideMode();
      }

      return App.prototype.openPage.call(this, pageName);
    }
  });
});
