module.exports = fQuery => {
    fQuery.exec = (cmd, options) => {
        const child_process = require('child_process');

        return new Promise((resolve, reject) => {
            child_process.exec(cmd.join(' '), options, (err, stdout, stderr) => {
                if (err) {
                    reject(stderr);
                } else {
                    resolve(stdout);
                }
            });
        });
    };
};
