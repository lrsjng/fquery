'use strict';

module.exports = function (fQuery) {

    fQuery.fn.edit = function (fn, includeBuffers) {

        return this.push(this.clone().each(function (blob, idx) {

            if (!includeBuffers && blob.content === undefined) {
                return;
            }

            fn.call(this, blob, idx);
        }));
    };

    fQuery.fn.asyncEdit = function (fn, includeBuffers) {

        var fquery = this;
        var clone = this.clone();
        var promises = clone.map(function (blob, idx) {

            if (!includeBuffers && blob.content === undefined) {
                return fQuery.Q();
            }

            if (fn.length < 3) {
                return fQuery.Q(fn.call(this, blob, idx));
            }

            var deferred = fQuery.Q.defer();
            fn.call(this, blob, idx, deferred.resolve, deferred.reject);
            return deferred.promise;
        });

        return fQuery.Q.all(promises).then(function (blobs) {

            if (blobs === undefined) {
                blobs = clone;
            }

            fquery.push(blobs);
        });
    };

    fQuery.fn.thenEdit = function (fn, includeBuffers) {

        return this.then(function () {

            return this.asyncEdit(fn, includeBuffers);
        });
    };
};
