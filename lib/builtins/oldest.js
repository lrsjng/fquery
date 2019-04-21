module.exports = fQuery => {
    fQuery.fn.oldest = function fn1() {
        let blobs = [];

        this.each(blob => {
            if (!blobs[0] || blobs[0].timestamp > blob.timestamp) {
                blobs = [blob];
            } else if (blobs[0].timestamp === blob.timestamp) {
                blobs.push(blob);
            }
        });

        return this.push(blobs);
    };

    fQuery.fn.thenOldest = function fn1() {
        return this.then(function fn2() {
            return this.oldest();
        });
    };
};
