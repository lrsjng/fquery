const {is_str, is_regexp} = require('../util/misc');
const esc_str_regexp = require('escape-string-regexp');


module.exports = fQuery => {
    const mixin = {
        replace(re, to) {
            if (!is_regexp(re)) {
                re = new RegExp(esc_str_regexp(re), 'g');
            }
            return Object.assign(blob => this(blob).replace(re, to), mixin);
        },

        prefix(head, to) {
            return this.replace(new RegExp('^' + esc_str_regexp(head)), to);
        },

        suffix(tail, to) {
            return this.replace(new RegExp(esc_str_regexp(tail) + '$'), to);
        }
    };
    mixin.r = mixin.replace;
    mixin.p = mixin.prefix;
    mixin.s = mixin.suffix;

    const get_source = blob => blob && is_str(blob.source) && blob.source || is_str(blob) && blob || '';

    fQuery.map = Object.assign(get_source, mixin);
};
