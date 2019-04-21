module.exports = fQuery => {
    fQuery.fn.wrap = function fn1(prepend, append) {
        prepend = prepend || '';
        append = append || '';

        return this.edit(blob => {
            blob.content = prepend + blob.content + append;
        });
    };

    fQuery.fn.thenWrap = function fn1(prepend, append) {
        return this.then(function fn2() {
            return this.wrap(prepend, append);
        });
    };
};
