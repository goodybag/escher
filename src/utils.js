define(function(require){
   var
    // 3rd Party Dependencies
    $         = require('jquery')
  , _         = require('underscore')
  , Backbone  = require('backbone')
  // , amanda    = require('amanda')
  // , async     = require('async')

    // App Dependencies
  , config    = require('config')
  // , pubsub    = require('PubSubJS')

    // Module Variables
  // , validator = amanda('json')
  , utils     = {}
  ;

  utils.noop = function(){};

  utils.dom = $;

  require('backbone.subroute');

  utils.Backbone   = Backbone;
  utils.Events     = Backbone.Events;
  utils.Router     = Backbone.Router;
  utils.SubRouter  = Backbone.SubRoute;
  utils.Model      = Backbone.Model;
  utils.View       = Backbone.View;
  utils.Collection = Backbone.Collection;
  utils.History    = Backbone.History;

  utils = _.extend(utils, _);
  // utils = _.extend(utils, async);

  // utils.pubsub = pubsub;

  return utils;
});
