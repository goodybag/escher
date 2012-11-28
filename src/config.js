define(function(require){
  var config = function(options) {
    var newconfig = utils.extend(config, options);
    // store configuration in this function object
    config = utils.defaults(newconfig, {
        apps          : []        // - Holds the app registry before passing off to apps-handler
      , el            : undefined // - Default Top-Level App element
      , packageName   : 'package' // - Name of the App manifest file
      }
    );
    // :NOTE: defaults() are run on the entire config -- not just the options passed in
    // if defaults() were run on the options parameter, then config() could not be called twice
    // (the defaults would overwrite existing config)
  };

  return config;
});