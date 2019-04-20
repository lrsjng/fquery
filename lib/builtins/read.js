module.exports = fQuery => {
    fQuery.fn.read = function fn1() {
        return this.each(function fn2(blob) {
            try {
                blob.read();
            } catch (err) {
                fQuery.report({
                    type: 'err',
                    method: 'read',
                    message: err.message,
                    fquery: this, // eslint-disable-line
                    blob,
                    err
                });
            }
        });
    };

    fQuery.fn.thenRead = function fn1() {
        return this.then(function fn2() {
            return this.read(); // eslint-disable-line
        });
    };
};
