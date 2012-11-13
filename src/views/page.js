define(function(require){
  var
    utils     = require('utils')
  , logger    = require('logger')
  ;

  return utils.View.extend({
    className: 'page'

  , initialize: function(){
      return this;
    }

  , render: function(){
      this.el.innerHTML = this.template();
      return this;
    }

  , open: function(){
      var $this = this;
      utils.dom(this.el.parentElement).css('height', '2000px');
      this.$el.addClass('open');
      setTimeout(function(){ utils.dom($this.el.parentElement).css('height', 'auto'); }, 800);
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
