module.exports = fQuery => {
    fQuery.spawn = (cmd, options) => {
        const child_process = require('child_process');
        const deferred = fQuery.Q.defer();

        const onStdout = data => {
            deferred.notify({
                out: data.toString('utf-8'),
                err: false
            });
        };

        const onStderr = data => {
            deferred.notify({
                out: data.toString('utf-8'),
                err: true
            });
        };

        const onExit = code => {
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

        fQuery.report({
            type: 'info',
            method: 'spawn',
            message: cmd.join(' ')
        });

        const proc = child_process.spawn(cmd[0], cmd.slice(1), options);
        proc.stdout.on('data', onStdout);
        proc.stderr.on('data', onStderr);
        proc.on('exit', onExit);

        return deferred.promise;
    };
};
