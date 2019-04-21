module.exports = fQuery => {
    fQuery.fn.asyncEach = function fn1(fn) {
        const promises = this.map(function fn2(blob, idx) {
            return new Promise((resolve, reject) => {
                if (fn.length < 3) {
                    resolve(fn.call(this, blob, idx)); // eslint-disable-line
                    return;
                }

                fn.call(this, blob, idx, resolve, reject); // eslint-disable-line
            });
        });

        return Promise.all(promises);
    };

    fQuery.fn.thenEach = function fn1(fn) {
        return this.then(function fn2() {
            return this.asyncEach(fn); // eslint-disable-line
        });
    };
};
