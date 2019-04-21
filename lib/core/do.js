module.exports = fQuery => {
    fQuery.fn.do = function fn1(fn) {
        if (fQuery._.isFunction(fn)) {
            fn.call(this); // eslint-disable-line
        }

        return this;
    };

    fQuery.fn.asyncDo = function fn1(fn) {
        return new Promise((resolve, reject) => {
            if (fQuery._.isFunction(fn)) {
                if (!fn.length) {
                    resolve(fn.call(this)); // eslint-disable-line
                    return;
                }

                fn.call(this, resolve, reject); // eslint-disable-line
                return;
            }

            resolve();
            return;
        });
    };

    fQuery.fn.thenDo = function fn1(fn) {
        return this.then(function fn2() {
            return this.asyncDo(fn); // eslint-disable-line
        });
    };
};
