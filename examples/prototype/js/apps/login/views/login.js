/**
* Prototype - Login Application - Login View
*/

define(['radagast', 'backbone', 'text!templates/login.html'], function(Radagast, Backbone, loginTemplate) {
	var _ = Radagast.Util._;

	return Backbone.View.extend({
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
});