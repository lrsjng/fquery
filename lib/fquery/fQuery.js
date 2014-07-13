/*jshint node: true */
'use strict';

var path = require('path'),
	_ = require('underscore'),
	q = require('q'),

	Event = require('./Event'),
	Blob = require('./Blob'),
	Selector = require('./Selector'),
	fmt = require('./format/blob'),

	selector = new Selector({ files: true, dirs: false, uniq: true, onlyStats: false }),

	publish = function (obj, array) {

		array = array || [];

		var ol = obj.length,
			al = array.length,
			i;

		for (i = 0; i < al; i += 1) {
			obj[i] = array[i];
		}
		for (i = al; i < ol || obj[i] !== undefined; i += 1) {
			delete obj[i];
		}

		obj.length = al;
	},

	FQuery = function () {};




// fQuery
// ======
var fQuery = module.exports = function () {

	var fquery = new FQuery();
	fquery._stack = [];
	fquery.push_instant(selector.blobs.apply(selector, arguments));
	return fquery;
};

fQuery.Event = Event;
fQuery.Blob = Blob;

fQuery.fn = fQuery.prototype = FQuery.prototype = {};

fQuery.fn.constructor = fQuery;


fQuery.fn.extend = fQuery.extend = function (obj) {

	_.extend(this, obj);
};


fQuery.fn.toString = function (lines, len) {

	return fmt.formatFQuery(this, lines, len);
};


fQuery.fn.inspect = function () {

	return this.toString();
};


fQuery.plugin = function (plugin) {

	if (_.isString(plugin)) {
		try {
			plugin = require(plugin);
		} catch (err) {
			fQuery.fail({
				method: 'plugin',
				message: err.toString(),
				data: err
			});
			return;
		}
	}

	if (_.isFunction(plugin)) {
		plugin = plugin(fQuery);
	}

	if (_.isObject(plugin)) {
		fQuery.fn.extend(plugin);
	} else if (plugin) {
		fQuery.fail({
			method: 'plugin',
			message: 'unsupported format: ' + plugin,
			data: plugin
		});
	}
};

fQuery.extend(Event);




// fQuery Core
// -----------
fQuery.fn.extend({

	// instant methods
	// ---------------

	push_instant: function (blobs) {

		blobs = _.isArray(blobs) ? blobs : [blobs];
		blobs = blobs.filter(function (blob) { return blob instanceof fQuery.Blob; });

		this._stack.unshift(blobs);
		publish(this, this._stack[0]);
	},


	pop_instant: function () {

		var popped = this._stack.shift();
		publish(this, this._stack[0]);
		return popped;
	},


	each_instant: function (fn) {

		var fquery = this,
			deferred = q.defer(),

			promises = _.map(this, function (blob, idx) {

				var deferred = q.defer();

				fn.call(fquery, blob, idx, deferred.resolve);
				if (fn.length < 3) {
					deferred.resolve();
				}

				return deferred.promise;
			});

		q.all(promises).done(deferred.resolve);
		return deferred.promise;
	},


	edit_instant: function (fn, all) {

		var fquery = this,
			deferred = q.defer(),

			clones = _.map(this, function (blob) { return blob.clone(); }),

			promises = clones.map(function (blob, idx) {

				var deferred = q.defer();

				if (all || blob.content !== undefined) {
					fn.call(fquery, blob, idx, deferred.resolve);
					if (fn.length < 3) {
						deferred.resolve();
					}
				} else {
					deferred.resolve();
				}

				return deferred.promise;
			});

		q.all(promises).done(function () {

			fquery.push_instant(clones);
			deferred.resolve();
		});
		return deferred.promise;
	},




	// queueing methods
	// ----------------

	then: function (fn) {

		var fquery = this,
			deferred = q.defer();

		if (!this._promise) {
			this._promise = q();
		}

		this._promise.then(function () {

			fn.call(fquery, deferred.resolve);
			if (fn.length < 1) {
				deferred.resolve();
			}
		});

		this._promise = deferred.promise;
		return this;
	},


	push: function (blobs) {

		return this.then(function () {

			this.push_instant(blobs);
		});
	},


	pop: function () {

		return this.then(function () {

			this.pop_instant();
		});
	},


	each: function (fn) {

		return this.then(function (done) {

			this.each_instant(fn).then(done);
		});
	},


	edit: function (fn, all) {

		return this.then(function (done) {

			this.edit_instant(fn).then(done);
		});
	}
});




// load plugins
// ------------
new Selector({files: true, dirs: true, uniq: true, onlyStats: true})
	.paths(__dirname + ': builtins/*, ../plugins/*')
	.forEach(function (path) { fQuery.plugin(path); });
