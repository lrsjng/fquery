/*jshint node: true */
'use strict';


var _ = require('lodash');
var fmt = require('./format/event');


var types = {
        // ERROR: {color: 'red', icon: '☹', lines: 10},
        // FAIL: {color: 'red', icon: '☹', lines: -3},
        // INFO: {color: 'cyan', icon: '😶', lines: -3},
        // OK: {color: 'green', icon: '☺', lines: -3},
        // SUCCESS: {color: 'green', icon: '☺', lines: -3},
        // WARNING: {color: 'yellow', icon: '😐', lines: -3}
        ERROR: {color: 'red', icon: '[err] ', lines: 10},
        FAIL: {color: 'red', icon: '[fail]', lines: -3},
        INFO: {color: 'cyan', icon: '[info]', lines: -3},
        OK: {color: 'green', icon: '[okay]', lines: -3},
        SUCCESS: {color: 'green', icon: '[okay]', lines: -3},
        WARNING: {color: 'yellow', icon: '[warn]', lines: -3}
    };


function Event(arg) {

    arg = arg || {};

    if (Array.isArray(arg)) {
        return arg.map(function (a) { return new Event(a); });
    }

    this.type = arg.type || types.INFO;
    this.method = arg.method || 'unknown method';
    this.message = arg.message || 'no message';
    this.fquery = arg.fquery;
    this.blob = arg.blob;
    this.file = arg.file;
    this.line = arg.line;
    this.column = arg.column;
    this.data = arg.data;
}
module.exports = Event;


Event.prototype.toString = function () {

    return fmt.format(this);
};


_.each(types, function (type, name) {

    Event[name.toLowerCase()] = function (arg) {

        var ev = new Event(arg);

        if (Array.isArray(ev)) {
            ev.forEach(function (e) { e.type = type; });
        } else {
            ev.type = type;
        }

        if (type === types.ERROR) {
            throw ev;
        }

        process.stdout.write(ev.toString());

        return ev;
    };
});
