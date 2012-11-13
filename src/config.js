define(function(require){
  return {
    validationOptions: {
      singleError: false
    }
  , apiUrl: 'http://local.goodybag.com/api/'
  , facebook: {
      oauthUrl: "https://www.facebook.com/dialog/oauth?response_type=token&display=popup"
    , id: "159340790837933"
    , redirectUri: "http://local.goodybag.com/fb-callback.html"
    }
  };
});
