/**
* Prototype - Document Controller
*/

define(['radagast', 'backbone'], function(Radagast, Backbone) {
	var PrototypeRouter = Backbone.Router.extend({
		routes:{
			':layout'           :'standardRoute',
			':layout/:app'      :'standardRoute',
			':layout/:app/:view':'standardRoute'
		}
	});

	var PrototypeDocument = Radagast.Document.extend({
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
			this.bindRouter(new PrototypeRouter());
			// bindRouter should:
			//   this.router = new PrototypeRouter();
			//   this.router.on('all', _.bind(this.trigger, this)); // rebroadcasts the events
			Backbone.history.start({ pushState:true });
			Radagast.Util.RequestEvents.listen();
		},

		standardRoute:function(layout, app, view) {
			this.setLayout(layout);
			this.setApp('main', app || this.layout.defaultMain);
			if (view) {
				this.getApp('main').setView(view);
			}
		},

		onAfterLayout:function(layout) {
			if (layout == 'standard') {
				this.setApp('widget1', this.layout.defaultWidget1);
				this.setApp('widget2', this.layout.defaultWidget2);
				this.setApp('widget3', this.layout.defaultWidget3);
			}
		}
	});

	return PrototypeDocument;
});