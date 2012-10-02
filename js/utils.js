define(function(require){
   var
    // 3rd Party Dependencies
    $         = require('jquery')
  , _         = require('lodash')
  , Backbone  = require('backbone')
  , amanda    = require('amanda')

    // App Dependencies
  , config    = require('config')
  , pubsub    = require('PubSubJS')

    // Module Variables
  , validator = amanda('json')
  , cachedImg = {}
  , utils     = {}
  ;

  utils.noop = function(){};

  utils.dom = $;

  utils.Events     = Backbone.Events;
  utils.Router     = Backbone.Router;
  utils.Model      = Backbone.Model;
  utils.View       = Backbone.View;
  utils.Collection = Backbone.Collection;

  utils = _.extend(utils, _);

  utils.pubsub = pubsub;

  utils.getImage = function(path, callback){
    if (cachedImg[path]) return callback(null, path);
    var cache = document.createElement('img');
    cache.onerror = function(e){
      cachedImg[path] = false;
      callback(e);
    };
    cache.onload = function(){
      cachedImg[path] = true;
      callback(null, path);
    };
    cache.src = path;
  };

  /**
   * Ol' boy crockfords String interpolation
   * @param  {String} str    The string you want to interpolate with
   * @param  {Object} values The object mapping the keys in the string to values
   * @return {String}        The result
   * @example
   *   "Hello, my name is {name}", { name: "Stacy" } => "Hello, my name is Stacy."
   */
  utils.interpolate = function(str, values){
    return str.replace(/{([^{}]*)}/g, function(a, b){
      var r = values[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  };

  utils.http = {};

  /**
   * Make an http POST request
   * @param  {string}   url      The requested URL
   * @param  {object}   data     Data to send
   * @param  {Function} callback Passes in error, data when request is complete
   * @return {Null}
   */
  utils.post = function(url, data, callback){
    if (typeof data === "function"){
      callback = data;
      data = {};
    }
    return utils.req({
      url: config.apiUrl + url
    , dataType: 'json'
    , contentType: "application/json; charset=UTF-8"
    , type: "POST"
    , data: JSON.stringify(data)
    , xhrFields: {
        withCredentials: true
      }
    , crossDomain: true
    , error: function(xhr, textStatus, error){
        logger.error(error);
      }
    , success: function(response){
        callback(response.error, response.data);
      }
    });
  };

  /**
   * Make an http GET request
   * @param  {string}   url      The requested URL
   * @param  {object}   data     Data to send
   * @param  {Function} callback Passes in error, data when request is complete
   * @return {Null}
   */
  utils.get = function(url, data, callback){
    if (typeof data === "function"){
      callback = data;
      data = {};
    }
    return utils.req({
      url: config.apiUrl + url
    , dataType: 'json'
    , contentType: "application/json; charset=UTF-8"
    , type: "GET"
    , data: data
    , xhrFields: {
        withCredentials: true
      }
    , crossDomain: true
    , error: function(xhr, textStatus, error){
        logger.error(error);
      }
    , success: function(response){
        callback(response.error, response.data);
      }
    });
  };

  /**
   * Make an http PUT request
   * @param  {string}   url      The requested URL
   * @param  {object}   data     Data to send
   * @param  {Function} callback Passes in error, data when request is complete
   * @return {Null}
   */
  utils.put = function(url, data, callback){
    if (typeof data === "function"){
      callback = data;
      data = {};
    }
    return utils.req({
      url: config.apiUrl + url
    , dataType: 'json'
    , contentType: "application/json; charset=UTF-8"
    , type: "PUT"
    , data: data
    , xhrFields: {
        withCredentials: true
      }
    , crossDomain: true
    , error: function(xhr, textStatus, error){
        logger.error(error);
      }
    , success: function(response){
        callback(response.error, response.data);
      }
    });
  };

  /**
   * Make an http DEL request
   * @param  {string}   url      The requested URL
   * @param  {object}   data     Data to send
   * @param  {Function} callback Passes in error, data when request is complete
   * @return {Null}
   */
  utils.del = function(url, data, callback){
    if (typeof data === "function"){
      callback = data;
      data = {};
    }
    return utils.req({
      url: config.apiUrl + url
    , dataType: 'json'
    , contentType: "application/json; charset=UTF-8"
    , type: "DEL"
    , data: data
    , xhrFields: {
        withCredentials: true
      }
    , crossDomain: true
    , error: function(xhr, textStatus, error){
        logger.error(error);
      }
    , success: function(response){
        callback(response.error, response.data);
      }
    });
  };

  utils.req = function(req){
    return $.ajax(req);
  };

  return utils;
});
