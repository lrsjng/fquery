module.exports = fQuery => {
    fQuery.fn.clone = function fn1() {
        return fQuery(this.map(blob => blob.clone()));
    };

    fQuery.fn.thenClone = function fn1() {
        return this.then(function fn2() {
            return this.clone();
        });
    };
};
