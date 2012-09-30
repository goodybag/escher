define(function(require){
  var
    utils     = require('utils')
  , logger    = require('logger')
  , templates = require('templates')
  ;

  return utils.View.extend({
    className: 'app'

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
  });
});
