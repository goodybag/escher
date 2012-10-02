define(function(require){
  var
    utils     = require('utils')
  , logger    = require('logger')
  ;

  return utils.View.extend({
    className: 'app'

  , pages: {}
  , instantiated: {}
  , current: null

  , addPage: function(page){
      if (this.pageInstantiated(page)) this.destroyPage(page);
      this.pages[page.name] = page;
      return this;
    }

  , openPage: function(pageName){
      if (!this.pageExists(pageName))
        return logger.warn("[App.openPage] - Page {page} does not exist", { page: pageName }), this;

      // Close the current page
      if (this.current) this.closeCurrent();

      // Instantiate, render, and add to the dom if we haven't already
      if (!this.pageInstantiated(pageName)){
        logger.info("[App.openPage] - Instantiating Page {page}", { page: pageName });
        this.instantiatePage(pageName);
        this.current = this.instantiated[pageName];
        this.current.render();
        this.$el.find('.pages').append(this.current.$el);
      } else this.current = this.instantiated[pageName];

      this.current.open();
      return this;
    }

  , closeCurrent: function(){
      if (!this.current) return logger.warn("[App.closeCurrent] - There is no page open"), this;
      this.current.close();
      return this;
    }

  , closePage: function(pageName){
      if (!this.pageExists(pageName))
        return logger.warn(utils.interpolate("[App.closePage] - Page {page} does not exist", { page: pageName })), this;
      if (!this.pageInstantiated(pageName))
        return logger.warn(utils.interpolate("[App.closePage] - Page {page} is not instantiated", { page: pageName })), this;
      this.pages[pageName].close();
      if (this.current.name === pageName) this.current = null;
      return this;
    }

  , pageExists: function(pageName){
      return !!this.pages[pageName];
    }

  , pageInstantiated: function(pageName){
      return !!this.instantiated[pageName];
    }

  , instantiatePage: function(pageName){
      if (!this.pageExists(pageName)){
        logger.warn("[App.instantiatePage] - Page {page} does not exist");
        return this;
      }
      if (this.pageInstantiated(pageName)) this.destroyPage(pageName);
      this.instantiated[pageName] = new this.pages[pageName]({ user: this.user });

      return this;
    }

  , destroyPage: function(pageName){
      if (!this.pageExists(pageName))
        return logger.warn("[App.destroyPage] - Page {page} does not exist", { page: pageName }), this;
      this.instantiated[pageName].destroy();
      this.instantiated[pageName] = null;
      return this;
    }

  , open: function(){
      this.$el.addClass('open');
      this._isOpen = true;
      return this;
    }

  , close: function(){
      this.$el.removeClass('open');
      this._isOpen = false;
      return this;
    }

  , isOpen: function(){
      // Cast to boolean just in case the _isOpen variable doesn't exist yet
      return !!this._isOpen;
    }

  , destroy: function(){
      // Need to dispose of events and what-not
    }
  });
});
