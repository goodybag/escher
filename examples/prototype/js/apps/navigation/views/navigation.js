/**
* Prototype - Navigation Application - Navigation View
*/

define(['radagast', 'backbone', 'text!templates/navigation.html'], function(Radagast, Backbone, navigationTemplate) {
	var _ = Radagast.Util._;

	return Backbone.View.extend({
		template:_.template(navigationTemplate),

		events:{
			'click .nav'   :'onClickNav',
			'click .logout':'onClickLogout'
		},

		onClickNav:function(e) {
			// ask the document to navigate
			_.http.dispatch('put', 'rad://document.core/url', { url:e.target.getAttribute('href') });
			// :NOTE: we might give a message on failure, if we like (could happen if in login view)
		},

		onClickLogout:function() {
			// ask the session to clear out
			_.http.dispatch('delete', 'rad://sessions.core/user');
		},

		render:function() {
			var html = this.template({ app:this.app });
			this.$el.html(html);
		}
	});
});