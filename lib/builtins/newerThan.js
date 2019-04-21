const {is_fn} = require('../util/misc');


module.exports = fQuery => {
    const depsNewerThanTarget = (depsStamps, targetStamp) => {
        for (let i = 0, l = depsStamps.length; i < l; i += 1) {
            if (depsStamps[i] >= targetStamp) {
                return true;
            }
        }
        return false;
    };

    fQuery.fn.newerThan = function fn1(arg, deps, keepAll) {
        let keepThisBlobs = [];
        const depsStamps = fQuery(deps).map(blob => blob.timestamp.valueOf());

        this.each(function fn2(blob, idx) {
            let target = arg;
            let targetStamp;

            if (is_fn(target)) {
                target = target.call(this, blob, idx); // eslint-disable-line
            }

            const targetBlob = fQuery(target).get(0);

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
            keepThisBlobs = this; // eslint-disable-line
        }

        return this.push(keepThisBlobs);
    };

    fQuery.fn.thenNewerThan = function fn1(arg, deps, keepAll) {
        return this.then(function fn2() {
            return this.newerThan(arg, deps, keepAll); // eslint-disable-line
        });
    };
};
