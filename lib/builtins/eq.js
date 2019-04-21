module.exports = fQuery => {
    fQuery.fn.eq = function fn1(idx) {
        return this.push(this.get(idx));
    };

    fQuery.fn.thenEq = function fn1(idx) {
        return this.then(function fn2() {
            return this.eq(idx);
        });
    };

    fQuery.fn.first = function fn1() {
        return this.eq(0);
    };

    fQuery.fn.thenFirst = function fn1() {
        return this.thenEq(0);
    };

    fQuery.fn.last = function fn1() {
        return this.eq(-1);
    };

    fQuery.fn.thenLast = function fn1() {
        return this.thenEq(-1);
    };
};
