'use strict';

module.exports = function (fQuery) {

    fQuery.exec = function (cmd, options) {

        var child_process = require('child_process');
        var deferred = fQuery.Q.defer();

        child_process.exec(cmd.join(' '), options, function (err, stdout, stderr) {

            if (err) {
                deferred.reject(stderr);
            } else {
                deferred.resolve(stdout);
            }
        });

        return deferred.promise;
    };
};
