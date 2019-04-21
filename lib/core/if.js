const {is_fn} = require('../util/misc');


module.exports = fQuery => {
    fQuery.fn.if = function fn1(condition, thenFn, elseFn) {
        if (is_fn(condition)) {
            condition = Reflect.apply(condition, this, []);
        }

        return this.do(condition ? thenFn : elseFn);
    };

    fQuery.fn.asyncIf = function fn1(condition, thenFn, elseFn) {
        if (is_fn(condition)) {
            condition = Reflect.apply(condition, this, []);
        }

        return this.asyncDo(condition ? thenFn : elseFn);
    };

    fQuery.fn.thenIf = function fn1(condition, thenFn, elseFn) {
        return this.then(function fn2() {
            return this.asyncIf(condition, thenFn, elseFn);
        });
    };
};
