module.exports = fQuery => {
    fQuery.fn.add = function fn1(arg) {
        const blobs = [];
        const paths = {};

        this.each(blob => {
            blobs.push(blob);
            paths[blob.source] = true;
        });

        fQuery(arg).each(blob => {
            if (!paths[blob.source]) {
                blobs.push(blob);
            }
        });

        return this.push(blobs);
    };

    fQuery.fn.thenAdd = function fn1(arg) {
        return this.then(function fn2() {
            return this.add(arg); // eslint-disable-line
        });
    };
};
