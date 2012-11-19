/**
* Prototype - Navigation Application - Navigation View
*/

define(['radagast', 'backbone', 'text!templates/navigation.html'], function(Radagast, Backbone, navigationTemplate) {
	var _ = Radagast.Util._;

	return Backbone.View.extend({
		template:_.template(navigationTemplate),

		events:{
			'click .logout':'onClickLogout'
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