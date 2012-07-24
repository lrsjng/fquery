/*jshint node: true */
'use strict';

var path = require('path'),
	fs = require('fs'),
	_ = require('underscore'),


	reInclude = /^([ \t]*)\/\/[ \t]*@include[ \t]+(|base:)(["'])(.+)\3[; \t]*$/gm,
	reEmptyLine = /^\s+$/gm,
	reEndsFailSafe = /;?(\s*)$/,

	Err = function (message, stack, line, column) {

		this.message = message;
		this.stack = stack;
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

	recursion = function (settings, stack, file, content) {

		if (_.indexOf(stack, file) >= 0) {
			throw new Err('circular reference: "' + file + '"', stack);
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
				if (err instanceof Err) {
					throw err;
				}

				var pos = findPos(content, match);
				throw new Err('not found in ' + file + '[' + pos.line + ':' + pos.column + ']: "' + reference + '" -> "' + refFile + '"', stack, pos.line, pos.column);
			}

			return refContent;
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

		if (!settings.file && !settings.content) {
			throw new Err('neither file nor content specified');
		}

		return recursion(settings, [], settings.file, settings.content);
	};
