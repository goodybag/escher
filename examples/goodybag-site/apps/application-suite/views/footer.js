define(function(require){
  var
    rad       = require('radagast')
  , utils     = require('utils')
  , template  = require('hbt!./../html/footer')

  , logger    = new rad.logger("LandingSite.Footer")
  ;

  return utils.View.extend({
    events: {
      'mouseenter': 'onMouseEnter'
    , 'mouseleave': 'onMouseLeave'
    }

  , initialize: function(options){
      this.template = template;

      this.slideMode = (options && options.slideMode !== undefined) ? options.slideMode : true;
      this.animating = false;
      this.shown     = false;

      // Setup a limited API
      rad.subscribe('footer.toggle',          utils.bind(this.toggle,         this));
      rad.subscribe('footer.show',            utils.bind(this.show,           this));
      rad.subscribe('footer.hide',            utils.bind(this.hide,           this));
      rad.subscribe('footer.enterSlideMode',  utils.bind(this.enterSlideMode, this));
      rad.subscribe('footer.exitSlideMode',   utils.bind(this.exitSlideMode,  this));

      return this;
    }

  , render: function(){
      // We're re-rendering which will put it not in slide mode by default
      // So let's keep track of previous state
      var wasInSlideMode  = this.slideMode;
      this.slideMode      = false;
      this.$el.html(this.template());
      this.$slide = this.$el.find('.slide');
      if (wasInSlideMode) this.enterSlideMode();
      return this;
    }

  , toggle: function(callback){
      return this[this.shown ? 'hide' : 'show'](callback);
    }

  , hide: function(callback){
      // Bail out if we're not in slide mode or we're already in the up position
      if (!this.slideMode || this.shown) return this;
      var _this = this;
      this.animating = true;
      this.$slide.slideUp(400, function(){
        _this.animating = false;
        _this.$el.addClass('active');
        _this.$slide.hide();
        if (typeof callback === "function") callback();
      });
    }

  , show: function(callback){
      // Bail out if we're not in slide mode or we're already in the up position
      if (!this.slideMode || this.shown) return this;
      var _this = this;
      this.animating = true;
      this.$slide.slideDown(400, function(){
        _this.animating = false;
        _this.$el.removeClass('active');
        if (typeof callback === "function") callback();
      });
    }

  , enterSlideMode: function(){
      if (this.slideMode) return this;
      this.slideMode = true;
      this.$el.addClass('open-close');
      this.hide();
      return this;
    }

  , exitSlideMode: function(){
      if (!this.slideMode) return this;
      this.slideMode = false;
      this.$el.removeClass('open-close');
      return this;
    }

  , onMouseEnter: function(e){
      if (!this.slideMode || this.animating) return false;
      logger.info("Mouse Enter");
      this.show();
      this.trigger('mouseenter', e);
    }

  , onMouseLeave: function(e){
      if (!this.slideMode || this.animating) return false;
      logger.info("Mouse Leave");
      this.hide();
      this.trigger('mouseleave', e);
    }
  });
});