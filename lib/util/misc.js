const is_str = x => typeof x === 'string';
const is_fn = x => typeof x === 'function';
const is_num = x => typeof x === 'number';
const is_arr = x => Array.isArray(x);
const is_regexp = x => x instanceof RegExp;

module.exports = {
    is_str,
    is_fn,
    is_num,
    is_arr,
    is_regexp
};
