/**
* Prototype - Dashboard Application - Statistic Model
*/

define(['radagast', 'backbone'], function(Radagast, Backbone) {
	var _ = Radagast.Util._;

	return Backbone.Model.extend({
		defaults:{
			label:'',
			value:0
		}
	});
});