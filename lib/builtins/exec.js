module.exports = fQuery => {
    fQuery.exec = (cmd, options) => {
        const child_process = require('child_process');
        const deferred = fQuery.Q.defer();

        child_process.exec(cmd.join(' '), options, (err, stdout, stderr) => {
            if (err) {
                deferred.reject(stderr);
            } else {
                deferred.resolve(stdout);
            }
        });

        return deferred.promise;
    };
};
