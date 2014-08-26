/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.report = function (arg) {

        var reporter = fQuery.reporter;

        if (reporter && fQuery._.isFunction(reporter.onReport)) {
            reporter.onReport(arg);
        }
    };
};
