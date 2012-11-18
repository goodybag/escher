/**
* Prototype - Document Controller
*/

define(['radagast', 'backbone'], function(Radagast, Backbone) {
	var _ = Radagast.Util._;

	// Navigation Routes
	// =================
	var DocumentRouter = Backbone.Router.extend({
		routes:{
			':layout'           :'standardRoute',
			':layout/:app'      :'standardRoute',
			':layout/:app/:view':'standardRoute'
		}
	});

	var PrototypeDocument = Radagast.Document.extend({
		// User Session State
		// ==================
		userSession: {
			username:null,
			sessid:null
		},

		isUserAuthorized:function() {
			return (this.userSession.sessid !== null);
		},

		// Layouts
		// =======
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
				defaultMain:'js/apps/login'
			},
			standard:{
				apps:['main', 'navigation', 'widget1', 'widget2', 'widget3'],
				defaultMain:'js/apps/dashboard',
				defaultWidget1:'js/apps/calendar',
				defaultWidget2:'js/apps/todo',
				defaultWidget3:'js/apps/clock'
			}
		},

		// Server Routes
		// =============
		// :NOTE: how the document server works
		//   the document is registered to 'rad://document.core' (or something like it)
		//   the TLD (.core) should be distinct from application TLDs (.ui or .app, whatever we settle on) to avoid collisions
		//   applications then make requests to 'rad://document.core' to interact with the top-level
		// :NOTE: the content-type filter should default to json, to save us from specifying it most of the time
		serverRoutes:{
			'PUT   /url' :'handleNavigateRequest',
			'PUT   /user':'handleUserAuthRequest',
			'POST  /user':'handleUserSignupRequest',
			'RESET /user':'handleUserResetRequest'
		},

		// Setup
		// =====
		initialize:function() {
			// convert all link clicks and form submits into request DOM events
			Radagast.Util.RequestEvents.bind();

			// take over the browser address bar
			this.router = new DocumentRouter();
			_.bindEvents(this, this.router); // => param2.on('all', _.bind(param1.trigger, param1)); // rebroadcasts all events of the given emitter
			Backbone.history.start({ pushState:true });

			// load the login layout
			this.setLayout('login');
			this.setApp('main', this.layout.defaultMain);
		},

		// Navigation Events
		// =================
		standardRoute:function(layout, app, view) {
			// route change; make adjustments to our state
			// :NOTE: setLayout and setApp will do nothing if given value is current value
			this.setLayout(layout);
			this.setApp('main', app || this.layout.defaultMain);
			if (view) {
				this.getApp('main').setView(view);
			}
		},

		// Layout Events
		// =============
		onAfterLayout:function(layout) {
			// post-layout event; load any apps that might not be active
			this.setApp('navigation', 'js/apps/navigation');
			if (layout == 'standard') {
				this.setApp('widget1', this.layout.defaultWidget1);
				this.setApp('widget2', this.layout.defaultWidget2);
				this.setApp('widget3', this.layout.defaultWidget3);
			}
		},

		// Request Handlers
		// ================
		// PUT /url
		handleNavigateRequest:function(request, match) {
			// :TODO: should this be standardized in Radagast.Document?

			// validate
			if (!request.body.url) {
				return _.http.response(400, 'Request body must include "url"');
			}

			// an application has requested top-level navigation
			if (this.layout !== 'login' && _.contains(['navigation', 'main'], request.authorization.appid)) {
				this.router.navigate(request.body.url, { trigger:true }); // do it to it
				return _.http.response(200, 'OK');
			} else {
				// only allow the navigation or the main app to do top-level nav
				return _.http.response(403, 'Not allowed');
			}
		},

		// PUT /user
		handleUserAuthRequest:function(request, match) {
			// :TODO: permissions for who can make this request? (just the login app, right?)
			// :TODO: deauthorization (logout) -- would that just a PUT with a null username?

			// validate request
			// :NOTE: since we're just piping this to a remote domain, we could probably not bother validating (it'll validate there)
			//   the only reason is to lower latency, and to act as an example of clientside validation
			// :TODO: I'm just making up this '_.validate' function, but we should have something like it, amirite?
			//   it would produce an "errors" object if there's a problem, with each key containing the message of the first failure
			//   so, for instance, if the username was 1 character long, and the password was undefined, it would return...
			//   { username:'Must be at least 3 characters long', password:'Required' }
			var errors = _.validate(function(assert) {
				assert(request.body.username, 'username')
					.isA('string', 'Required')
					.minLength(3, 'Must be at least 3 characters long')
					.maxLength(12, 'Must be no more than 12 characters long');
				assert(request.body.password, 'password')
					.isA('string', 'Required')
					.minLength(3, 'Must be at least 3 characters long');
			});
			if (errors) {
				return _.http.response(400, 'Invalid username or password', { body:{ errors:errors }, 'content-type':'application/json' });
			}

			// request a new session from our remote host
			var session_request = _.http.request.pipe(request, { uri:'https://foobar.com/sessions' });
			_.http.response.onOK(session_request, function(res) {
				// user has successfully logged in
				this.setLayout('standard');
				this.userSession.username = request.body.username;
				this.userSession.sessid = res.body.sessid;

			});
			return session_request;
		},

		// POST /user
		handleUserSignupRequest:function(request, match) {
			return _.http.response(500, 'Not yet implemented');
		},

		// RESET /user
		handleUserResetRequest:function(request, match) {
			return _.http.response(500, 'Not yet implemented');
		}
	});

	return PrototypeDocument;
});