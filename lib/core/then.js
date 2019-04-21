module.exports = fQuery => {
    fQuery.fn.isPending = function fn() {
        return !!this._pending;
    };

    fQuery.fn.getPromise = function fn() {
        this._promise = this._promise || Promise.resolve();
        return this._promise;
    };

    fQuery.fn.then = function fn1(fn) {
        const self = this;

        this._promise = this._promise || Promise.resolve();
        this._promise = this._promise.then(() => {
            if (typeof fn !== 'function') {
                return null;
            }
            if (!fn.length) {
                const result = fn.call(self); // eslint-disable-line
                // don't misinterpret fquery results as promise because it is a thenable
                return result instanceof fQuery ? null : result;
            }
            return new Promise((resolve, reject) => {
                fn.call(self, resolve, reject); // eslint-disable-line
            });
        });

        this._pending = true;
        this._promise.finally(() => {
            this._pending = false;
        });

        return this;
    };
};
