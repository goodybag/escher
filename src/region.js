/**
 * Region
 *
 * Manages Child-App/DOM relationships
 *
 * It might be a good idea to make the distinction of regions and
 * multi-app regions a little more clear by making them different classes.
 * For now, we'll leave it as it is.
 */

define(function(require){
  var
    utils   = require('./utils')
  , Logger  = require('./logger')

  , logger  = new Logger("Region")

  , Region  = function(parent, selector, appName){
      logger.info("Instantiating {appName} in {selector} ", {
        appName:  appName.toString()
      , selector: selector
      });

      if (utils.isArray(appName)) this._isMulti = true;

      this.parent       = parent;
      this.selector     = selector;
      this.appName      = appName;
      this._hasSetApp   = false;
      this.setApps      = {};
      this.current      = null;
    }
  ;

  Region.prototype.getApp = function(appName){
    if (!this.isMulti()) return this.current;
    return this.setApps[appName];
  };

  Region.prototype.hasSetApp = function(appName){
    if (!this.isMulti()) return this._hasSetApp;
    return !!this.setApps[appName];
  };

  Region.prototype.setApp = function(app){
    logger.debug("set app", this.selector);

    var $el = this.parent.$el.find(this.selector);

    // Multi-application regions have swap and append functionality
    if (this.isMulti()){
      var name = app._package.name;

      // If we've previously set the app, we might have to do some clean up
      if (this.hasSetApp(name)){
        var oldApp = this.getApp(name);

        // Same app, no need to do anything
        if (oldApp.cid === app.cid){
          logger.warn("Attempting to set an app that has already been set");
          return this;
        }

        // New app so we need to replace old one
        // Ideally, we'd have some mechanism for managing events and cleaning binding
        // But we'll get there
        oldApp.undelegateEvents();
        this.parent.$el.remove(oldApp.$el);
      }

      // Append the new application
      app.$el.css('display', 'none');
      $el.append(app.$el);

      // Cache the app
      this.setApps[name] = app;

      return this;
    }

    // Not a multi-app region
    // If we've previously setup an app check to see if we need to clean up
    if (this.hasSetApp()){

      // Same app, no need to do anything
      if (this.current.cid === app.cid){
        logger.warn("Attempting to set app that has already been set");
        return this;
      }

      // Different app clear old
      this.current.undelegateEvents();
      $el.html("");
    }
    logger.debug("Setting el", this.selector, app, $el.length);
    app.setElement($el);
    this.current = app;
    this._hasSetApp = true;

    return this;
  };

  Region.prototype.getAppName = function(){
    return this.appName;
  };

  Region.prototype.isMulti = function(){
    return this._isMulti;
  };

  Region.prototype.open = function(appName){
    if (!this.isMulti()) return this;

    if (this.appName.indexOf(appName) === -1) return logger.error("Can't find appliction: " + appName), this;

    if (this.current) this.current.$el.css('display', 'none');
    this.current = this.getApp(appName);
    this.current.$el.css('display', 'block');

    return this;
  };

  Region.prototype.render = function(){
    logger.debug("Rendering", this.selector);
    this.current.render();
    return this;
  };

  return Region;
});