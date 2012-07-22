/*jshint node: true, strict: false */

var path = require('path'),
	_ = require('underscore'),

	error = require('./Error').error,
	Blob = require('./Blob'),
	Stack = require('./Stack'),
	Selector = require('./Selector'),

	selector = new Selector({ files: true, dirs: false, uniq: true, onlyStats: false });



// fQuery
// ======
var fQuery = module.exports = function () {

	return new Stack(selector.blobs(Array.prototype.slice.call(arguments)));
};

fQuery.fn = fQuery.prototype = Stack.prototype;

fQuery.fn.extend = function (obj) {

	_.extend(fQuery.fn, obj);
};

fQuery.error = function (method, message, fquery, blob, err) {

	error(method, message, fquery, blob, err);
};

fQuery.plugin = function (plugin) {

	if (_.isString(plugin)) {
		try {
			plugin = require(plugin);
		} catch (err) {
			fQuery.error('plugin', err.toString(), undefined, undefined, err);
		}
	}
	if (_.isFunction(plugin)) {
		plugin = plugin(fQuery);
	}
	if (_.isObject(plugin)) {
		fQuery.fn.extend(plugin);
	} else {
		fQuery.error('plugin', 'unsupported format: ' + plugin, undefined, undefined, plugin);
	}
};

fQuery.virtualBlob = Blob.virtual;

fQuery.selectBlob = Blob.select;



// fQuery Core
// -----------
fQuery.fn.extend({

	constructor: fQuery,

	error: function (method, message, blob, err) {

		fQuery.error(method, message, this, blob, err);
		return this;
	},

	get: function (idx) {

		if (!_.isNumber(idx)) {
			return Array.prototype.slice.call(this);
		}

		return this[idx];
	},

	pushStack: function (blobs) {

		blobs = _.filter(_.isArray(blobs) ? blobs : [blobs], function (blob) {

			return blob instanceof Blob;
		});

		this._push(blobs);
		return this;
	},

	end: function () {

		this._pop();
		return this;
	},

	each: function (fn) {

		_.each(this, function (blob) {

			fn.call(blob, blob);
		});

		return this;
	},

	edit: function (fn, all) {

		var list = [];

		_.each(this, function (blob) {

			var clone = blob.clone();
			if (all || clone.content !== undefined) {
				fn.call(clone, clone);
			}
			list.push(clone);
		});

		return this.pushStack(list);
	},

	toString: function (lines, len) {

		var s = '';

		for (var i = 0, l = this.length; i < l; i += 1) {
			s += this[i].toString(lines, len, i);
		}

		return s + '\n';
	},

	log: function (lines, len) {

		console.log(this.toString(lines, len));
		return this;
	}
});



// load plugins
// ------------
_.each(selector.paths(path.join(__dirname, 'fQuery/*.js'), { files: true, dirs: false, uniq: true, onlyStats: true }), function (filepath) {

	fQuery.plugin('./fQuery/' + path.basename(filepath, '.js'));
});

_.each(selector.paths(path.join(__dirname, '../plugins/*'), { files: false, dirs: true, uniq: true, onlyStats: true }), function (dirpath) {

	fQuery.plugin('../plugins/' + path.basename(dirpath));
});
