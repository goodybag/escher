# Radagast - A front-end web application architecture framework built on top of Backbone

I think we'll change the name, but Radagast seeks to help create large-scale, well-separated backbone apps with an emphasis on lazy-loading. The goal is to provide abstractions to break your application into tiny applications. Once the separate small applications are built, a large main app or suite can be composed from the smaller pieces.

## Design Goals

While the project is far from complete and is still very mutable, we should keep the following design goals in mind:

* The path to developing an app with Radagast should be clear in the beginning stages of the app and with less ambiguity on how an app should be setup than a typical backbone app. That is, Radagast should be opinionated to a certain degree.
* Lazy-load as many resources as possible with ease
* Applications should be as standalone as possible - Routers, views, templates, even styles
* We should adopt proven design patterns like module, facade, and mediator
* It should cut down development time
* Require.js and Backbone should both be used
* Applications can be composed of other applications and are embedded in one another

## What's the difference?

There are more than one solutions to the very problem we're trying to solve. However, each solution fails in its own way. Please see the (https://github.com/goodybag/radagast/wiki/Differences-between-Marionette)[wiki] for differences.

## What does it look like

Typically, you will setup your directory structure with something like this:

```
- apps/
    - application-1
      - collections
      - models
      - styles
      - templates
      - views
        app.js        // Main application view
      app.js          // Application manifest file
```

Application manifests contain just enough information to get the application registered in the application handler. It should not contain any logic outside of the routes used for the app

```javascript
/**
 * Landing Site Application
 * Handles all of the sub-page apps
 */

define(function(require){
  var
    channel = require('channel')
  , user    = require('user')
  ;

  return {
    appViewPath: './views/app'

  , router: {
      initialize: function(options){
        // An instance the application will be passed to the route
        this.app = options.app;
      }

    , routes: {
        "":                   "landing"
      , "charities":          "charities"
      , "businesses":         "businesses"
      }

    , landing: function(){
        this.app.openPage('landing');
      }

    , charities: function(){
        this.app.openPage('charities');
      }

    , businesses: function(){
        this.app.openPage('businesses');
      }
    }

  , permissions: {
      /* Do something here I'm not quite sure yet */
    }

    // When the application is opened or started, the pre-reqs chain is called
  , prereqs: {
      loggedIn: function(next){
        user.isLoggedIn(function(error, result){
          if (result) next();
          else channel.local.publish('user:notLoggedIn')
        });
      }
    }
  };
});
```

Notice that router is not a Backbone.Router class. Since route paths are relative to where the application is instantiated, we need to do some custom work to the router when it's created based on where the app is required. For that reason, all we need is an object that describes the router class, not the actual class itself.

### More to come