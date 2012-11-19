/**
* Prototype - Dashboard Application
*/

define(['radagast', 'backbone', 'collection/statistic', 'views/stats'], function(Radagast, Backbone, StatCollection, StatsView) {
	var _ = Radagast.Util._;

	return Radagast.Application.extend({
		views:{
			'stats' :StatsView
		},

		initialize:function() {
			this.statCollection = new StatCollection();
			this.setView('stats');

			// get the current user from the sessions service
			// :NOTE: this request could probably be standardized -- this.getSession or something
			var session_req = _.http.dispatch('get', 'rad://sessions.core/user');
			_.http.response.onOK(session_req, function(res, data) {
				this.statCollection.url = 'rad://localstorage.core/' + data.username + '-stats';
				this.statCollection.fetch();
			});
		}
	});
});