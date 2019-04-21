module.exports = fQuery => {
    fQuery.mkdirp = dirpath => {
        const fs = require('fs');

        try {
            fs.mkdirpSync(dirpath, {recusive: true});
            fQuery.report({
                type: 'okay',
                method: 'mkdirp',
                message: dirpath
            });
        } catch (e) {
            fQuery.report({
                type: 'err',
                method: 'mkdirp',
                message: e.message,
                err: e
            });
        }
        return fQuery(dirpath, {dirs: true});
    };
};
