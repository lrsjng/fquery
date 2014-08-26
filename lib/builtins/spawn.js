/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.spawn = function (cmd, options) {

        var child_process = require('child_process');
        var deferred = fQuery.Q.defer();

        var onStdout = function (data) {

                deferred.notify({
                    out: data.toString('utf-8'),
                    err: false
                });
            };

        var onStderr = function (data) {

                deferred.notify({
                    out: data.toString('utf-8'),
                    err: true
                });
            };

        var onExit = function (code) {

                if (code) {
                    fQuery.report({
                        type: 'err',
                        method: 'spawn',
                        message: 'exit code ' + code
                    });
                    deferred.reject(code);
                } else {
                    fQuery.report({
                        type: 'okay',
                        method: 'spawn',
                        message: 'done'
                    });
                    deferred.resolve(code);
                }
            };

        var proc;

        fQuery.report({
            type: 'info',
            method: 'spawn',
            message: cmd.join(' ')
        });

        proc = child_process.spawn(cmd[0], cmd.slice(1), options);
        proc.stdout.on('data', onStdout);
        proc.stderr.on('data', onStderr);
        proc.on('exit', onExit);

        return deferred.promise;
    };
};
