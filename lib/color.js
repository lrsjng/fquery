/*jshint node: true, strict: false */

var tty = require('tty');


var color = module.exports = function (type, str) {

	if (!color.useColors) {
		return str;
	}
	return '\033[' + color.colors[type] + 'm' + str + '\033[0m';
};

color.useColors = tty.isatty(1) && tty.isatty(2);

color.colors = {
	'white': 0,
	'whiteL': 1,
	'black': 30,
	'blackI': 40,
	'blackL': 90,
	'red': 31,
	'redI': 41,
	'redL': 91,
	'green': 32,
	'greenI': 42,
	'greenL': 92,
	'yellow': 33,
	'yellowI': 43,
	'yellowL': 93,
	'blue': 34,
	'blueI': 44,
	'blueL': 94,
	'purple': 35,
	'purpleI': 45,
	'purpleL': 95,
	'cyan': 36,
	'cyanI': 46,
	'cyanL': 96
};

color.log = function () {

	require('underscore').each(color.colors, function (int, col) {

		console.log(color(col, 'abc ABC --- ### ' + col));
	});
};
