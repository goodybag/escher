/**
* Prototype - Dashboard Application - Statistic Collection
*/

define(['radagast', 'backbone', 'model/statistic'], function(Radagast, Backbone, StatModel) {
	var _ = Radagast.Util._;

	return Backbone.Collection.extend({
		model:StatModel
	});
});