/*jshint node: true, strict: false */

var _ = require('underscore');


var Args = module.exports = function (checks, defaults) {

	this.checks = _.extend({}, checks);
	this.defaults = _.extend({}, defaults);
};

Args.prototype.parse = function (list) {

	var parsed = _.extend({}, this.defaults),
		args = Array.prototype.slice.call(list);

	_.each(this.checks, function (check, name) {

		var checked = false;
		_.each(args, function (arg, idx) {

			if (!checked && check(arg)) {
				parsed[name] = arg;
				args.splice(idx, 1);
				checked = true;
			}
		});
	});

	return parsed;
};
