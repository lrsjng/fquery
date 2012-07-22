/*jshint node: true, strict: false */

var path = require('path'),
	_ = require('underscore'),

	error = require('./Error').error,
	Blob = require('./Blob'),
	Stack = require('./Stack'),
	Selector = require('./Selector'),

	selector = new Selector({ files: true, dirs: false, uniq: true });



// fQuery
// ======
var fQuery = module.exports = function () {

	return new Stack(selector.blobs(Array.prototype.slice.call(arguments)));
};

fQuery.error = error;

fQuery.virtualBlob = Blob.virtual;

fQuery.selectBlob = Blob.select;

fQuery.plugin = function (name) {

	var plugin = require(name);

	if (_.isFunction(plugin)) {
		plugin = plugin(fQuery);
	}
	if (_.isObject(plugin)) {
		fQuery.fn.extend(plugin);
	}
};

fQuery.fn = fQuery.prototype = Stack.prototype;

fQuery.fn.extend = function (obj) {

	_.extend(fQuery.fn, obj);
};



// fQuery Core
// -----------
fQuery.fn.extend({

	constructor: fQuery,

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

	edit: function (fn) {

		var list = [];

		_.each(this, function (blob) {

			var clone = blob.clone();
			fn.call(clone, clone);
			list.push(clone);
		});

		return this.pushStack(list);
	},

	toString: function (lines, len) {

		var idx = 0,
			s = '';

		this.each(function () {

			s += this.toString(lines, len, idx);
			idx += 1;
		});
		return s + '\n';
	},

	log: function (lines, len) {

		console.log(this.toString(lines, len));
		return this;
	}
});



// load plugins
// ------------
_.each(selector.paths(path.join(__dirname, 'fQuery/*.js'), { files: true, dirs: false, uniq: true }), function (filepath) {

	fQuery.plugin('./fQuery/' + path.basename(filepath, '.js'));
});

_.each(selector.paths(path.join(__dirname, '../plugins/*'), { files: false, dirs: true, uniq: true }), function (dirpath) {

	fQuery.plugin('../plugins/' + path.basename(dirpath));
});
