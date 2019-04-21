const {is_str, is_fn} = require('../util/misc');


module.exports = fQuery => {
    const constant_fn = constant => () => constant;

    const syntax_check = (opname, fquery, arg) => {
        if (!is_fn(arg) && !is_str(arg)) {
            fQuery.report({
                type: 'err',
                method: opname,
                message: 'argument needs to be String or Function: ' + arg,
                fquery
            });
        }

        if (is_str(arg) && fquery.length > 1) {
            fQuery.report({
                type: 'err',
                method: opname,
                message: 'constant filepath not allowed for more than one selected item: ' + arg,
                fquery
            });
        }
    };

    const overwrite_check = (overwrite, opname, fquery, blob, dest) => {
        const fs = require('fs');

        if (!overwrite && fs.existsSync(dest)) {
            fQuery.report({
                type: 'err',
                method: opname,
                message: 'target file already exists: ' + dest,
                fquery,
                blob
            });
        }
    };

    const operation = (opname, fquery, arg, overwrite) => {
        syntax_check(opname, fquery, arg);

        if (is_str(arg)) {
            arg = constant_fn(arg);
        }

        fquery.each((blob, idx) => {
            const dest = arg.call(fquery, blob, idx); // eslint-disable-line
            overwrite_check(overwrite, opname, fquery, blob, dest);
            try {
                blob[opname](dest);
                fQuery.report({
                    type: 'okay',
                    method: opname,
                    message: dest,
                    fquery,
                    blob
                });
            } catch (e) {
                fQuery.report({
                    type: 'err',
                    method: opname,
                    message: e.message,
                    fquery,
                    blob,
                    data: dest,
                    err: e
                });
            }
        });
    };


    fQuery.fn.write = function fn1(arg, overwrite) {
        operation('write', this, arg, overwrite);
        return this;
    };

    fQuery.fn.thenWrite = function fn1(arg, overwrite) {
        return this.then(function fn2() {
            return this.write(arg, overwrite); // eslint-disable-line
        });
    };

    fQuery.fn.move = function fn1(arg, overwrite) {
        operation('move', this, arg, overwrite);
        return this;
    };

    fQuery.fn.thenMove = function fn1(arg, overwrite) {
        return this.then(function fn2() {
            return this.move(arg, overwrite); // eslint-disable-line
        });
    };
};
