/*jshint node: true */
'use strict';

var path = require('path'),
	_ = require('underscore'),
	semver = require('semver'),

	pkg = require('../package.json'),

	Event = require('./Event'),
	Blob = require('./Blob'),
	Mapper = require('./Mapper'),
	Selector = require('./Selector'),
	fmt = require('./format/blob'),

	selector = new Selector({ files: true, dirs: false, uniq: true, onlyStats: false }),

	latestUid = 0,

	publish = function (obj, array) {

		array = array || [];

		var ol = obj.length,
			al = array.length;

		for (var i = 0; i < al; i += 1) {
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

	return fquery.pushStack(selector.blobs.apply(selector, arguments));
};

fQuery.fn = fQuery.prototype = FQuery.prototype = {};

fQuery.fn.extend = fQuery.extend = function (obj) {

	_.extend(this, obj);
};


fQuery.extend({

	version: function (arg) {

		return arg === undefined ? pkg.version : semver.satisfies(pkg.version, arg);
	},

	uid: function () {

		latestUid += 1;
		return '' + latestUid;
	},

	plugin: function (plugin) {

		if (_.isString(plugin)) {
			try {
				plugin = require(plugin);
			} catch (err) {
				fQuery.error({
					method: 'plugin(' + plugin + ')',
					message: err.toString(),
					data: err
				});
			}
		}
		if (_.isFunction(plugin)) {
			plugin = plugin(fQuery);
		}
		if (_.isObject(plugin)) {
			fQuery.fn.extend(plugin);
		} else if (plugin) {
			fQuery.error({
				method: 'plugin',
				message: 'unsupported format: ' + plugin,
				data: plugin
			});
		}
	},

	virtualBlob: Blob.virtual,

	selectBlob: Blob.select,

	map: Mapper
});

fQuery.extend(Event);




// fQuery Core
// -----------
fQuery.fn.extend({

	constructor: fQuery,

	pushStack: function (blobs) {

		blobs = _.filter(_.isArray(blobs) ? blobs : [blobs], function (blob) {

			return blob instanceof Blob;
		});

		this._stack.unshift(blobs);
		publish(this, this._stack[0]);
		return this;
	},

	end: function () {

		this._stack.shift();
		publish(this, this._stack[0]);
		return this;
	},

	get: function (idx) {

		if (!_.isNumber(idx)) {
			return Array.prototype.slice.call(this);
		}

		return idx < 0 ? this[this.length + idx] : this[idx];
	},

	each: function (fn) {

		var fquery = this;

		_.each(this, function (blob, idx) {

			fn.call(blob, blob, idx, fquery);
		});

		return this;
	},

	edit: function (fn, all) {

		var fquery = this;

		return this.pushStack(_.map(this, function (blob, idx) {

			var clone = blob.clone();

			if (all || clone.content !== undefined) {
				fn.call(clone, clone, idx, fquery);
			}

			return clone;
		}));
	},

	toString: function (lines, len) {

		return fmt.formatFQuery(this, lines, len);
	},

	log: function (lines, len) {

		process.stdout.write(this.toString(lines, len));
		return this;
	},

	inspect: function () {

		return this.toString(0);
	}
});



// load plugins
// ------------
_.each(selector.paths(path.resolve(__dirname, 'fQuery/*.js'), { files: true, dirs: false, uniq: true, onlyStats: true }), function (filepath) {

	fQuery.plugin('./fQuery/' + path.basename(filepath, '.js'));
});

_.each(selector.paths(path.resolve(__dirname, '../plugins/*'), { files: false, dirs: true, uniq: true, onlyStats: true }), function (dirpath) {

	fQuery.plugin('../plugins/' + path.basename(dirpath));
});
