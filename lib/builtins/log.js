module.exports = fQuery => {
    fQuery.fn.log = function fn1(lines, len) {
        process.stdout.write(this.toString(lines, len));
        return this;
    };

    fQuery.fn.thenLog = function fn1(lines, len) {
        return this.then(function fn2() {
            return this.log(lines, len); // eslint-disable-line
        });
    };
};
