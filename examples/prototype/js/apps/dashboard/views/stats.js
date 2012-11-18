/**
* Prototype - Dashboard Application - Stats View
*/

define(['radagast', 'backbone', 'text!templates/stats.html'], function(Radagast, Backbone, statsTemplate) {
	var _ = Radagast.Util._;

	return Backbone.View.extend({
		template:_.template(statsTemplate),

		events:{
			// ?
		},

		render:function() {
			var html = this.template({ app:this.app });
			this.$el.html(html);
		}
	});
});