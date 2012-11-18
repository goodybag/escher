/**
* Prototype - Navigation Application
*/

define(['radagast', 'backbone', 'views/navigation'], function(Radagast, Backbone, NavView) {
	var _ = Radagast.Util._;

	return Radagast.Application.extend({
		views:{
			'nav':NavView
		},

		initialize:function() {
			this.setView('nav');
		}
	});
});