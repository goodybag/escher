/**
* Prototype - Session Service
*/

define(['radagast', 'backbone'], function(Radagast, Backbone) {
	var _ = Radagast.Util._;

	return Radagast.Application.extend({
		serverRoutes:{
			'GET    /user':'handleGetUserRequest',
			'PUT    /user':'handleAuthRequest',
			'POST   /user':'handleSignupRequest',
			'RESET  /user':'handleResetRequest',
			'DELETE /user':'handleLogoutRequest'
		},

		initialize:function() {
			this.clearSession();
		},

		isUserAuthorized:function() {
			return (this.userSession.sessid !== null);
		},

		clearSession:function() {
			this.userSession = { username:null, sessid:null };
		},

		// GET /user
		handleGetUserRequest:function(request, match) {
			return _.http.response(200, 'OK', { body:this.userSession });
		},

		// PUT /user
		handleAuthRequest:function(request, match) {
			// :TODO: permissions for who can make this request? (just the login app, right?)
			// :TODO: deauthorization (logout) -- would that just a PUT with a null username?

			// request a new session from our remote host
			var session_request = _.http.request.pipe(request, { uri:'https://foobar.com/sessions' });
			_.http.response.onOK(session_request, function(res) {
				// user has successfully logged in
				this.userSession.username = request.body.username;
				this.userSession.sessid = res.body.sessid;
				this.trigger('authenticated');
			});
			return session_request;
		},

		// POST /user
		handleSignupRequest:function(request, match) {
			return _.http.response(500, 'Not yet implemented');
		},

		// RESET /user
		handleResetRequest:function(request, match) {
			return _.http.response(500, 'Not yet implemented');
		},

		// DELETE /user
		handleLogoutRequest:function(request, match) {
			this.clearSession();
			this.trigger('deauthenticated');
			return _.http.response(200, 'OK');
		}
	});
});