module.exports = fQuery => {
    fQuery.spawn = (cmd, options) => {
        const child_process = require('child_process');

        return new Promise((resolve, reject) => {
            let out = '';

            const onStdout = data => {
                out += data;
            };

            const onStderr = data => {
                out += data;
            };

            const onExit = code => {
                if (code) {
                    fQuery.report({
                        type: 'err',
                        method: 'spawn',
                        message: 'exit code ' + code
                    });
                    reject(code);
                } else {
                    fQuery.report({
                        type: 'okay',
                        method: 'spawn',
                        message: 'done'
                    });
                    resolve(out);
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
        });
    };
};
