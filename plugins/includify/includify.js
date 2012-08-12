/*jshint node: true */
'use strict';

var path = require('path'),
	fs = require('fs'),
	_ = require('underscore'),
	glob = require('glob'),


	reInclude = /^([ \t]*)\/\/[ \t]*@include[ \t]+(|base:)(["'])(.+)\3[; \t]*$/gm,
	reEmptyLine = /^\s+$/gm,
	reEndsFailSafe = /;?(\s*)$/,

	Err = function (message, stack, file, line, column) {

		this.message = message;
		this.stack = stack;
		this.file = file;
		this.line = line;
		this.column = column;
	},

	findPos = function (content, match) {

		var character = content.indexOf(match);

		content = content.slice(0, character);
		content = content.split('\n');

		return {
			line: content.length,
			column: content[content.length - 1].length + match.indexOf('@include') + 1
		};
	},

	globOptions = {
		dot: true,
		silent: false,
		sync: true
	},
	pathsForGlob = function (pattern) {

		return _.map(glob(pattern, globOptions), function (filepath) {

			return path.resolve(filepath);
		});
	},

	recursion = function (settings, stack, file, content) {

		if (_.indexOf(stack, file) >= 0) {
			throw new Err('circular reference: "' + file + '"', stack);
		}
		stack.push(file);

		content = content.replace(reInclude, function (match, indent, mode, quote, reference) {

			var refPattern = path.normalize(path.join(path.dirname(file), reference)),
				refPaths = pathsForGlob(refPattern);

			return _.map(refPaths, function (refPath) {

				try {
					var refContent = fs.readFileSync(refPath, settings.charset);
					refContent = refContent.replace(reEndsFailSafe, function (match, whiteEnd) {
						return ';' + whiteEnd;
					});
					refContent = recursion(settings, stack, refPath, refContent);
					refContent = indent + refContent.replace(/\n/g, '\n' + indent);
					refContent = refContent.replace(reEmptyLine, '');

					return refContent;
				} catch (err) {
					if (err instanceof Err) {
						throw err;
					}

					var pos = findPos(content, match);
					throw new Err('not found: "' + reference + '"', stack, file, pos.line, pos.column);
				}
			}).join('\n\n');
		});

		stack.pop();
		return content;
	},

	defaults = {
		file: undefined,
		content: undefined,
		charset: 'utf-8'
	},

	includify = module.exports = function (options) {

		var settings = _.extend({}, defaults, options);

		if (!settings.file || !settings.content) {
			throw new Err('file and/or content undefined');
		}

		return recursion(settings, [], settings.file, settings.content);
	};
