define(function(require){
  var
    utils     = require('utils')
  , App       = require('views/app')
  // , NavView   = require('./views/nav')
  , template  = require('hbt!./templates/app')

  , Pages = {
      Landing:        require('./views/landing-page')
    , Charities:      require('./views/charities-page')
    , Legal:          require('./views/legal-page')
    , Privacy:        require('./views/privacy-page')
    , Businesses:     require('./views/businesses-page')
    }
  ;

  return App.extend({
    template: template

  , pages: {
      'landing':      Pages.Landing
    , 'charities':    Pages.Charities
    , 'legal':        Pages.Legal
    , 'privacy':      Pages.Privacy
    , 'businesses':   Pages.Businesses
    }

  , initial: 'landing'

  , initialize: function(){
      this.$el.html(this.template());
      this.children = {
        // nav: new NavView({ el: this.$el.find('.nav') })
      // , footer: new FooterView({ el: this.$el.find('.footer') })
      };
      return this;
    }

  , render: function(){
      // this.children.nav.render();
      // this.children.footer.render();
      if (this.current) this.current.render();
      return this;
    }

  , openPage: function(pageName){
      // Add/remove the class for the landing page for styling
      // if (pageName === "landing") utils.dom(document.body).addClass('index');
      // else setTimeout(function(){ utils.dom(document.body).removeClass('index'); }, 800);
      utils.dom(document.body)[(pageName === "landing" ? "add" : "remove") + "Class"]('index');
      return App.prototype.openPage.call(this, pageName);
    }
  });
});
