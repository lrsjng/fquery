module.exports = fQuery => {
    fQuery.fn.not = function fn1(arg) {
        const blobs = [];
        const paths = {};

        fQuery(arg).each(blob => {
            paths[blob.source] = true;
        });

        this.each(blob => {
            if (!paths[blob.source]) {
                blobs.push(blob);
            }
        });

        return this.push(blobs);
    };

    fQuery.fn.thenNot = function fn1(arg) {
        return this.then(function fn2() {
            return this.not(arg); // eslint-disable-line
        });
    };
};
