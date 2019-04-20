module.exports = fQuery => {
    fQuery.fn.getContent = function fn1(sep) {
        return this.map(blob => {
            return fQuery._.isString(blob.content) ? blob.content : '';
        }).join(sep || '');
    };
};
