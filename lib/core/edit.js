module.exports = fQuery => {
    fQuery.fn.edit = function fn1(fn, includeBuffers) {
        return this.push(this.clone().each(function fn2(blob, idx) {
            if (!includeBuffers && blob.content === undefined) {
                return;
            }

            fn.call(this, blob, idx); // eslint-disable-line
        }));
    };

    fQuery.fn.asyncEdit = function fn1(fn, includeBuffers) {
        const self = this;
        const clone = this.clone();
        const promises = clone.map(function fn2(blob, idx) {
            if (!includeBuffers && blob.content === undefined) {
                return fQuery.Q();
            }

            if (fn.length < 3) {
                return fQuery.Q(fn.call(this, blob, idx)); // eslint-disable-line
            }

            const deferred = fQuery.Q.defer();
            fn.call(this, blob, idx, deferred.resolve, deferred.reject); // eslint-disable-line
            return deferred.promise;
        });

        return fQuery.Q.all(promises).then(blobs => {
            if (blobs === undefined) {
                blobs = clone;
            }

            self.push(blobs);
        });
    };

    fQuery.fn.thenEdit = function fn1(fn, includeBuffers) {
        return this.then(function fn2() {
            return this.asyncEdit(fn, includeBuffers); // eslint-disable-line
        });
    };
};
