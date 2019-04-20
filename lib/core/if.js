module.exports = fQuery => {
    fQuery.fn.if = function fn1(condition, thenFn, elseFn) {
        if (fQuery._.isFunction(condition)) {
            condition = condition.call(this); // eslint-disable-line
        }

        return this.do(condition ? thenFn : elseFn);
    };

    fQuery.fn.asyncIf = function fn1(condition, thenFn, elseFn) {
        if (fQuery._.isFunction(condition)) {
            condition = condition.call(this); // eslint-disable-line
        }

        return this.asyncDo(condition ? thenFn : elseFn);
    };

    fQuery.fn.thenIf = function fn1(condition, thenFn, elseFn) {
        return this.then(function fn2() {
            return this.asyncIf(condition, thenFn, elseFn); // eslint-disable-line
        });
    };
};
