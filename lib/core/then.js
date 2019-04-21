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
                return fn;
            }
            if (!fn.length) {
                const result = Reflect.apply(fn, self, []);
                // don't misinterpret fquery results as promise because it is a thenable
                return result instanceof fQuery ? null : result;
            }
            return new Promise((resolve, reject) => {
                Reflect.apply(fn, self, [resolve, reject]);
            });
        });

        this._pending = true;
        this._promise.finally(() => {
            this._pending = false;
        });

        return this;
    };
};
