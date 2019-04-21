const {is_str} = require('../util/misc');


module.exports = fQuery => {
    fQuery.fn.concat = function fn1(sep) {
        let latest = new Date(0);
        const content = this.map(blob => {
            if (blob.timestamp > latest) {
                latest = blob.timestamp;
            }

            return is_str(blob.content) ? blob.content : '';
        }).join(sep || '');

        return this.push(fQuery.Blob.fromContent('concat', content, new Date(latest)));
    };

    fQuery.fn.thenConcat = function fn1(sep) {
        return this.then(function fn2() {
            return this.concat(sep);
        });
    };
};
