define(function(require){
  var
    utils     = require('utils')
  , App       = require('views/app')
  // , NavView   = require('./views/nav')
  // , template  = require('hbt!./templates/app')
  ;

  return App.extend({
    // template: template

    initialize: function(){
      this.$el.html(this.template());
      this.children = {
        nav: new NavView({ el: this.$el.find('.nav') })
      // , footer: new FooterView({ el: this.$el.find('.footer') })
      };
      return this;
    }

  , render: function(){
      this.children.nav.render();
      // this.children.footer.render();
      if (this.current) this.current.render();
      return this;
    }
  });
});
