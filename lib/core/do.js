const {is_fn} = require('../util/misc');


module.exports = fQuery => {
    fQuery.fn.do = function fn1(fn) {
        if (is_fn(fn)) {
            Reflect.apply(fn, this, []);
        }

        return this;
    };

    fQuery.fn.asyncDo = function fn1(fn) {
        return new Promise((resolve, reject) => {
            if (is_fn(fn)) {
                if (!fn.length) {
                    resolve(Reflect.apply(fn, this, []));
                    return;
                }

                Reflect.apply(fn, this, [resolve, reject]);
                return;
            }

            resolve();
            return;
        });
    };

    fQuery.fn.thenDo = function fn1(fn) {
        return this.then(function fn2() {
            return this.asyncDo(fn);
        });
    };
};
