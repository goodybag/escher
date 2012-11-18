/**
* Prototype - Login Application
*/

define([
	'radagast', 'backbone',
	'text!templates/login.html', 'text!templates/signup.html', 'text!templates/reset.html'
], function(Radagast, Backbone, loginTemplate, signupTemplate, resetTemplate) {
	var _ = Radagast.Util._;

	// Login View
	// ==========
	var LoginView = Backbone.View.extend({
		template:_.template(loginTemplate),

		events:{
			'response form':'onFormResponse',
			'click .signup':'onClickSignup',
			'click .reset' :'onClickReset'
		},

		onFormResponse:function(e) {
			this.app.setNotice(e.detail.response.reason);
			this.render();
		},

		onClickSignup:function() {
			this.app.clearNotice();
			this.app.setView('signup');
		},

		onClickReset:function() {
			this.app.clearNotice();
			this.app.setView('reset');
		},

		render:function() {
			var html = this.template({ app:this.app });
			this.$el.html(html);
		}
	});
	
	// New Account View
	// ================
	var SignupView = Backbone.View.extend({
		template:_.template(signupTemplate),

		events:{
			'response form':'onFormResponse',
			'click .cancel':'onClickCancel'
		},

		onFormResponse:function(e) {
			this.app.setNotice(e.detail.response.reason);
			this.render();
		},

		onClickCancel:function() {
			this.app.clearNotice();
			this.app.setView('login');
		},

		render:function() {
			var html = this.template({ app:this.app });
			this.$el.html(html);
		}
	});

	// Password Reset View
	// ===================
	var ResetView = Backbone.View.extend({
		template:_.template(resetTemplate),

		events:{
			'response form':'onFormResponse',
			'click .cancel':'onClickCancel'
		},

		onFormResponse:function(e) {
			this.app.setNotice(e.detail.response.reason);
			this.render();
		},

		onClickCancel:function() {
			this.app.clearNotice();
			this.app.setView('login');
		},

		render:function() {
			var html = this.template({ app:this.app });
			this.$el.html(html);
		}
	});

	// Application
	// ===========
	var LoginApplication = Radagast.Application.extend({
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

	return LoginApplication;
});