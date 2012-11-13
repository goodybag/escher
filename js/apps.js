define(function(require){
  return [
    {
      name: "suite"
    , package: require('apps/suite/app')
    }
  , {
      name: "landing-site"
    , package: require('apps/landing-site/app')
    }
  , {
      name: "consumer-panel"
    , package: require('apps/consumer-panel/app')
    }
  ];
});
