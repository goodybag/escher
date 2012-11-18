/**
* Prototype - Login Application - Signup View
*/

define(['radagast', 'backbone', 'text!templates/signup.html'], function(Radagast, Backbone, signupTemplate) {
	var _ = Radagast.Util._;
	
	return Backbone.View.extend({
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
});