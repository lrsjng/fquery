(function (global) {
	'use strict';
	/*global module, process, require, console */

	var path = require('path'),
		fs = require('fs'),
		_ = require('underscore'),


		defaults = {
			file: undefined,
			content: undefined,
			charset: 'utf-8'
		},
		reInclude = /^([ \t]*)\/\/[ \t]*@include[ \t]+(|base:)(["'])(.+)\3[; \t]*$/gm,
		reEmptyLine = /^\s+$/gm,
		reEndsFailSafe = /;?(\s*)$/,
		message = function (type, message, stack) {
			/*global console */

			if (console) {
				console.log('[includify:' + type + '] ' + message);
				if (stack) {
					console.log('stack', stack);
				}
			}
		},
		recursion = function (settings, stack, file, content) {

			if (_.indexOf(stack, file) >= 0) {
				message('err', 'circular reference: "' + file + '"', stack);
				return content;
			}
			stack.push(file);

			content = content.replace(reInclude, function (match, indent, mode, quote, reference) {

				var refFile = path.normalize(path.join(path.dirname(file), reference)),
					refContent;

				try {
					refContent = fs.readFileSync(refFile, settings.charset);
					refContent = refContent.replace(reEndsFailSafe, function (match, whiteEnd) {
						return ';' + whiteEnd;
					});
					refContent = recursion(settings, stack, refFile, refContent);
					refContent = indent + refContent.replace(/\n/g, '\n' + indent);
					refContent = refContent.replace(reEmptyLine, '');
				} catch (err) {
					refContent = match;
					message('err', 'not found: "' + reference + '" -> "' + refFile + '"', stack);
				}

				return refContent;
			});

			stack.pop();
			return content;
		},
		includify = function (options) {

			var file, content,
				settings = _.extend({}, defaults, options);

			if (!settings.file && !settings.content) {
				message('err', 'neither file nor content specified');
				return;
			}

			file = settings.file || path.join(process.cwd(), 'INPUT');
			content = settings.content || ''; // || fs.readFileSync(file, settings.charset);
			return recursion(settings, [], file, content);
		};

	module.exports = includify;

}(this));
