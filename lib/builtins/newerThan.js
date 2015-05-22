'use strict';

module.exports = function (fQuery) {

    var depsNewerThanTarget = function (depsStamps, targetStamp) {

        for (var i = 0, l = depsStamps.length; i < l; i += 1) {
            if (depsStamps[i] >= targetStamp) {
                return true;
            }
        }
        return false;
    };

    fQuery.fn.newerThan = function (arg, deps, keepAll) {

        var keepThisBlobs = [];
        var depsStamps = fQuery(deps).map(function (blob) { return blob.timestamp.valueOf(); });

        this.each(function (blob, idx) {

            var target = arg;
            var targetBlob;
            var targetStamp;

            if (fQuery._.isFunction(target)) {
                target = target.call(this, blob, idx);
            }

            targetBlob = fQuery(target).get(0);

            if (!targetBlob) {
                keepThisBlobs.push(blob);
            } else {
                targetStamp = targetBlob.timestamp.valueOf();

                if (blob.timestamp.valueOf() > targetStamp || depsNewerThanTarget(depsStamps, targetStamp)) {
                    keepThisBlobs.push(blob);
                }
            }
        });

        if (keepAll && keepThisBlobs.length) {
            keepThisBlobs = this;
        }

        return this.push(keepThisBlobs);
    };

    fQuery.fn.thenNewerThan = function (arg, deps, keepAll) {

        return this.then(function () {

            return this.newerThan(arg, deps, keepAll);
        });
    };
};
