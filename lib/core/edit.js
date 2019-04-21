module.exports = fQuery => {
    fQuery.fn.edit = function fn1(fn, includeBuffers) {
        return this.push(this.clone().each(function fn2(blob, idx) {
            if (!includeBuffers && blob.content === undefined) {
                return;
            }

            Reflect.apply(fn, this, [blob, idx]);
        }));
    };

    fQuery.fn.asyncEdit = function fn1(fn, includeBuffers) {
        const self = this;
        const clone = this.clone();
        const promises = clone.map(function fn2(blob, idx) {
            return new Promise((resolve, reject) => {
                if (!includeBuffers && blob.content === undefined) {
                    resolve();
                    return;
                }

                if (fn.length < 3) {
                    resolve(Reflect.apply(fn, this, [blob, idx]));
                    return;
                }

                Reflect.apply(fn, this, [blob, idx, resolve, reject]);
            });
        });

        return Promise.all(promises).then(blobs => {
            if (blobs === undefined) {
                blobs = clone;
            }

            self.push(blobs);
        });
    };

    fQuery.fn.thenEdit = function fn1(fn, includeBuffers) {
        return this.then(function fn2() {
            return this.asyncEdit(fn, includeBuffers);
        });
    };
};
