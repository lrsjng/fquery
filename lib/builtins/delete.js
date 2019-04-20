module.exports = fQuery => {
    fQuery.fn.delete = function fn1() {
        const rimraf = require('rimraf');

        this.each(function fn2(blob) {
            try {
                rimraf.sync(blob.source);
                fQuery.report({
                    type: 'okay',
                    method: 'delete',
                    message: blob.source,
                    fquery: this, // eslint-disable-line
                    blob
                });
            } catch (err) {
                fQuery.report({
                    type: 'err',
                    method: 'delete',
                    message: err.message,
                    fquery: this, // eslint-disable-line
                    blob,
                    data: err
                });
            }
        });
        return this;
    };

    fQuery.fn.thenDelete = function fn1() {
        return this.then(function fn2() {
            return this.delete(); // eslint-disable-line
        });
    };
};
