/*jshint node: true, strict: false */

var path = require('path'),
	_ = require('underscore'),

	error = require('./Error').error,
	Blob = require('./Blob'),
	Stack = require('./Stack'),
	findPaths = require('./Selector');



// fQuery
// ======
var fQuery = module.exports = function (arg) {

	if (arg instanceof Stack) {
		return arg;
	}

	if (arg instanceof Blob) {
		return new Stack([arg]);
	}

	if (_.isString(arg)) {
		var blobs = _.compact(_.map(findPaths(arg), function (filepath) {

			return Blob.select(filepath);
		}));

		return new Stack(blobs);
	}

	return new Stack();
};

// make it extendable
// ------------------
fQuery.fn = Stack.prototype;

fQuery.fn.extend = function (obj) {

	_.extend(fQuery.fn, obj);
};

// static methods
// --------------
fQuery.error = error;

fQuery.plugin = function (name) {

	var plugin = require(name);

	if (_.isFunction(plugin)) {
		plugin(fQuery);
	} else if (_.isObject(plugin)) {
		fQuery.fn.extend(plugin);
	}
};



// fQuery Core
// -----------
fQuery.fn.extend({

	toString: function () {

		var i = 0,
			s = '';

		_.each(this, function (blob) {
			s += '[' + i + '] ' +  blob.toString() + '\n';
			i += 1;
		});

		return s;
	},

	log: function () {

		console.log(this.toString());
		return this;
	},

	get: function (idx) {

		if (!_.isNumber(idx)) {
			return Array.prototype.slice.call(this);
		}

		return this[idx];
	},

	pushStack: function (blobs) {

		if (!_.isArray(blobs)) {
			blobs = [blobs];
		}
		blobs = _.filter(blobs, function (blob) {

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

	add: function (arg) {

		var list = [],
			paths = {};

		_.each(this, function (blob) {

			list.push(blob.clone());
			paths[blob.source] = true;
		});

		_.each(fQuery(arg), function (blob) {

			if (!paths[blob.source]) {
				list.push(blob);
			}
		});

		return this.pushStack(list);
	},

	not: function (arg) {

		var list = [],
			paths = {};

		_.each(fQuery(arg), function (blob) {

			paths[blob.source] = true;
		});

		_.each(this, function (blob) {

			if (!paths[blob.source]) {
				list.push(blob.clone());
			}
		});

		return this.pushStack(list);
	}
});



// load plugins
// ------------
_.each(findPaths(path.join(__dirname, 'fQuery/*.js')), function (p) {

	fQuery.plugin('./fQuery/' + path.basename(p, '.js'));
});

_.each(findPaths(path.join(__dirname, '../plugins/*')), function (p) {

	fQuery.plugin('../plugins/' + path.basename(p));
});
