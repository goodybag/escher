/**
 * Provides interface to all modules
 */

define(function(require){
  var
    utils     = require('utils')
  , SuiteView = require('views/suite')
  , suite     = new SuiteView()
  ;

  utils.extend(suite, utils.pubsub);

  return suite;
});
