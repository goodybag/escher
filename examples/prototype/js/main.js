/**
* Prototype - Document Controller
*/

define(['radagast', 'backbone'], function(Radagast, Backbone) {
	var _ = Radagast.Util._;

	var DocumentRouter = Backbone.Router.extend({
		routes:{
			':layout'           :'standardRoute',
			':layout/:app'      :'standardRoute',
			':layout/:app/:view':'standardRoute'
		}
	});

	var DocumentServer = Radagast.DocumentServer.extend({
		// :NOTE: how this server is used
		//   whatever server is set as the Radagast.Document server attribute is mapped to 'rad://document.core' (or something like it)
		//   the TLD (.core) should be distinct from application TLDs (.ui or .app, whatever we settle on) to avoid collisions
		//   applications then make requests to 'rad://document.core' to interact with the top-level
		// :NOTE: about DocumentServer
		//   Radagast.DocumentServer extends from Radagast.Server
		//   it provides standard routes for the Document to implement, as well as standard fallback handlers (usually noops)
		routes:{
			// put any custom routes here (inherits standard routes defined in DocumentServer)
		}
	});

	var PrototypeDocument = Radagast.Document.extend({
		// :NOTE: how layouts work
		//   when we change layouts, onBeforeLayout and onAfterLayout will be fired
		//   the body's class will also change to 'layout-<layoutname>'
		//   most changes to the page should occur by CSS responding to the new class
		//   however, the event handlers can change the DOM if needed
		//   this allows the layout to change without disrupting the active applications
		// :NOTE: how applications relate to layouts
		//   the 'apps' key specifies the valid applications in a given layout
		//   they must map to a div in the dom with an id of 'app-<appname>'
		//   their presence in the config does not cause anything to occur on layout load
		//   however, on layout unload, if an app is not present in the new layout, it will be unloaded automatically
		// :NOTE: the 'default*' keys are only used by this code, not by Radagast.Document
		//   they could auto-load, but it would force setLayout to include overrides to the defaults
		//   (unless you're okay with the wrong app getting loaded briefly)
		layouts:{
			login:{
				apps:['main', 'navigation'],
				defaultMain:'js/apps/login/manifest.js'
			},
			standard:{
				apps:['main', 'navigation', 'widget1', 'widget2', 'widget3'],
				defaultMain:'js/apps/dashboard/manifest.js',
				defaultWidget1:'js/apps/calendar/manifest.js',
				defaultWidget2:'js/apps/todo/manifest.js',
				defaultWidget3:'js/apps/time/manifest.js'
			}
		},

		initialize:function() {
			// convert all link clicks and form submits into request DOM events
			Radagast.Util.RequestEvents.bind();

			// take over the browser address bar
			this.router = new DocumentRouter();
			_.bindEvents(this, this.router); // => this.router.on('all', _.bind(this.trigger, this)); // rebroadcasts all events of the given emitter
			Backbone.history.start({ pushState:true });

			// start listening for HTTP requests from the applications
			this.server = new DocumentServer();
			_.bindEvents(this, this.server);

			// load the login layout
			this.setLayout('login');
			this.setApp('main', this.layout.defaultMain);
		},

		standardRoute:function(layout, app, view) {
			// route change; make adjustments to our state
			// :NOTE: setLayout and setApp will do nothing if given value is current value
			this.setLayout(layout);
			this.setApp('main', app || this.layout.defaultMain);
			if (view) {
				this.getApp('main').setView(view);
			}
		},

		onAfterLayout:function(layout) {
			// post-layout event; load any apps that might not be active
			this.setApp('navigation', 'js/apps/navigation/manifest.js');
			if (layout == 'standard') {
				this.setApp('widget1', this.layout.defaultWidget1);
				this.setApp('widget2', this.layout.defaultWidget2);
				this.setApp('widget3', this.layout.defaultWidget3);
			}
		},

		requestNavigate:function(request, match) {
			// :TODO: should this be standardized in Radagast.Document?
			
			// validate request
			if (!_.http.validate(request, { body:['url'] })) {
				return _.http.response([400, 'body must specify "url"']);
			}

			// an application has requested top-level navigation
			if (_.contains(['navigation', 'main'], request.authorization.appid)) {
				this.router.navigate(request.body.url, { trigger:true }); // do it to it
				return _.http.response([200, 'ok']);
			} else {
				// only allow the navigation or the main app to do top-level nav
				return _.http.response([403, 'not allowed']);
			}
		}
	});

	return PrototypeDocument;
});