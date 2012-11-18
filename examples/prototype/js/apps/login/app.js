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
			var res = e.detail.response;
			if (_.http.response.isOK(res)) {
				this.app.setNotice('Success!');
				// :NOTE: the document has begun the layout change, so we will be replaced shortly
			}
			else if (_.http.response.isRequestError(res)) {
				this.app.setNotice('Invalid username or password.');
			}
			else if (_.http.response.isServerError(res)) {
				this.app.setNotice('There was an internal server error while processing your request. ('+res.reason+')');
			}
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
			var res = e.detail.response;
			if (_.http.response.isOK(res)) {
				this.app.setNotice('Your account has been created. Please check your email for a confirmation link.');
				this.app.setView('login');
			}
			else if (_.http.response.isRequestError(res)) {
				this.app.setNotice('Unable to create your account: ' + res.reason);
				this.render();
			}
			else if (_.http.response.isServerError(res)) {
				this.app.setNotice('There was an internal server error while processing your request. ('+res.reason+')');
				this.render();
			}
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
			var res = e.detail.response;
			if (_.http.response.isOK(res)) {
				this.app.setNotice('An email has been sent with instructions on how to reset your password.');
				this.app.setView('login');
			}
			else if (_.http.response.isRequestError(res)) {
				this.app.setNotice('Invalid username.');
				this.render();
			}
			else if (_.http.response.isServerError(res)) {
				this.app.setNotice('There was an internal server error while processing your request. ('+res.reason+')');
				this.render();
			}
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