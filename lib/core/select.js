module.exports = fQuery => {
    const selector = new fQuery.Selector({files: true, dirs: false, uniq: true, onlyStats: false});

    fQuery.fn.select = function fn1(arg, options) {
        return this.push(selector.blobs(arg, options));
    };

    fQuery.fn.thenSelect = function fn1(arg, options) {
        return this.then(function fn2() {
            this.select(arg, options); // eslint-disable-line
        });
    };
};
