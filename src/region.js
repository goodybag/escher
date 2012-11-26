define(function(require){
  var
    utils   = require('./utils')
  , Logger  = require('./logger')

  , logger  = new Logger("Region")

  , Region  = function($el, selector, appName){
      if (utils.isArray(appName)) this._isMulti = true;

      this.$el          = $el;
      this.selector     = selector;
      this.appName      = appName;
      this._hasSetApp   = false;
      this.appEls       = {};
      this.$current     = null;
    }
  ;

  Region.prototype.getAppEl = function(appName){
    return this.appEls[appName];
  };

  Region.prototype.hasSetApp = function(appName){
    if (!this.isMulti()) return this._hasSetApp;
    return !!this._setApps[appName];
  };

  Region.prototype.setApp = function(app){
    if (this.isMulti()){
      var name = app._package.name;

      if (this.hasSetApp(name)){
        // Same app, no need to do anything
        if (this.getAppEl(name) === app.$el) return this;

        // New app so we need to replace old one
        this.$el.remove(this.getAppEl(name));
      }
      // Append the new application
      app.$el.css('display', 'none');
      this.$el.find(this.selector).append(app.$el);
    } else {
      // if (this.hasSetApp())
    }

    return this;
  };

  Region.prototype.getAppName = function(){
    return this.appName;
  };

  Region.prototype.isMulti = function(){
    return this._isMulti;
  };

  Region.prototype.open = function(app){
    if (!this.isMulti()) return this;

    if (this.appName.indexOf(appName) === -1) logger.error("Ca")

    if (this.$current) this.$current.css('display', 'none');
    this.$current = this.getAppEl(appName).css('')
  };

  return Region;
});