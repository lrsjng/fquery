const {is_str} = require('../util/misc');


module.exports = fQuery => {
    fQuery.fn.getContent = function fn1(sep) {
        return this.map(blob => {
            return is_str(blob.content) ? blob.content : '';
        }).join(sep || '');
    };
};
