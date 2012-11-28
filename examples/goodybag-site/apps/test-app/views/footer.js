define(function(require){
  var
    utils     = require('utils')
  , logger    = require('logger')
  , template  = require('hbt!./../templates/footer')
  ;

  return utils.View.extend({
    events: {
      'mouseenter': 'onMouseEnter'
    , 'mouseleave': 'onMouseLeave'
    }

  , initialize: function(){
      this.template = template;

      this.slideMode = false;
      this.animating = false;
      this.shown     = false;

      return this;
    }

  , render: function(){
      this.$el.html(this.template());
      this.$slide = this.$el.find('.slide');
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
      this.show();
      this.trigger('mouseenter', e);
    }

  , onMouseLeave: function(e){
      if (!this.slideMode || this.animating) return false;
      console.log('hide');
      this.hide();
      this.trigger('mouseleave', e);
    }
  });
});