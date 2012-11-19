/**
* Prototype - Local Storage Service
*   based on https://github.com/jeromegn/Backbone.localStorage
*/

define(['radagast', 'backbone'], function(Radagast, Backbone) {
	var _ = Radagast.Util._;

	return Radagast.Application.extend({
		serverRoutes:{
			'GET    /'               :'listCollections',
			'GET    /:collection'    :'getCollection',
			'DELETE /:collection'    :'deleteCollection',
			'POST   /:collection'    :'newItem',
			'GET    /:collection/:id':'getItem',
			'PUT    /:collection/:id':'setItem',
			'DELETE /:collection/:id':'deleteItem'
		},

		initialize:function() {
			this.collections = {};
		},

		// GET /
		listCollections:function() {
			return [200, 'Ok', { collections:this.collections }];
		},

		// GET /:collection
		getCollection:function(request, match) {
			var coll = this._getOrCreate[match.collection];
			var records = _(coll).chain()
				.map(function(id) { return JSON.parse(localStorage.getItem(match.collection+"-"+id)); })
				.compact()
				.value();
			return [200, 'Ok', records];
		},

		// DELETE /:collection
		deleteCollection:function(request, match) {
			if (_.has(this.collections, match.collection)) {
				// delete contained items from local storage
				_.each(this.collections[match.collection], function(record) {
					localStorage.removeItem(match.collection+'-'+record);
				});
				// delete collection
				localStorage.removeItem(match.collection);
				// drop reference
				delete this.collections[match.collection];
				return [200, 'Ok'];
			}
			// everything else creates the collection as-needed; here, it makes sense to let them know it wasnt around
			return [404, 'Collection not found'];
		},

		// POST /:collection
		newItem:function(request, match, record) {
			// save record
			if (!record.id) {
				record.id = record.idAttribute = guid();
			}
			localStorage.setItem(match.collection+'-'+record.id, JSON.stringify(record));

			// save collection
			var coll = this._getOrCreate[match.collection];
			coll.push(record.id.toString());
			this._save(match.collection);

			return [200, 'Ok'];
		},

		// GET /:collection/:id
		getItem:function(request, match) {
			var record = localStorage.getItem(match.collection+'-'+match.id);
			if (record) {
				return [200, 'Ok', JSON.parse(record)];
			}
			return [404, 'Item not found'];
		},

		// PUT /:collection/:id
		setItem:function(request, match, record) {
			// store record data
			localStorage.setItem(match.collection+'-'+match.id, JSON.stringify(record));

			// add to the collection, if new
			var coll = this._getOrCreate[match.collection];
			if (!_.include(coll, match.id)) {
				coll.push(match.id);
				this._save(math.collection);
			}
			return [200, 'Ok'];
		},

		// DELETE /:collection/:id
		deleteItem:function(request, match) {
			// remove record data
			localStorage.removeItem(match.collection+'-'+match.id);

			// remove from collection
			var coll = this._getOrCreate[match.collection];
			this.collections[match.collection] = _.reject(coll, function(record_id) { return record_id === match.id; });
			this._save(match.collection);

			return [200, 'Ok'];
		},

		_getOrCreate:function(c) {
			if (!_.has(this.collections, c)) {
				var store = localStorage.getItem(c);
				if (store) {
					this.collections[c] = store.split(',');
				} else {
					this.collections[c] = [];
				}
			}
			return this.collections[c];
		},

		_save:function(c) {
			if (_.has(this.collections, c)) {
				localStorage.setItem(c, this.collections[c].join(","));
			}
		}
	});
});