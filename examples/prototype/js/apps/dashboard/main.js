/**
* Prototype - Dashboard Application
*/

define(['radagast', 'backbone', 'views/stats'], function(Radagast, Backbone, StatsView) {
	var _ = Radagast.Util._;

	return Radagast.Application.extend({
		noticeMessage:null,

		views:{
			'login' :LoginView,
			'signup':SignupView,
			'reset' :ResetView
		},

		initialize:function() {
			this.setView('login');
		},

		setNotice:function(s) {
			this.noticeMessage = s;
		},

		clearNotice:function() {
			this.setNotice(null);
		}
	});
});