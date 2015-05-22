'use strict';

function publish(obj, array) {

    array = array || [];

    var ol = obj.length;
    var al = array.length;
    var i;

    for (i = 0; i < al; i += 1) {
        obj[i] = array[i];
    }
    for (i = al; i < ol || obj[i] !== undefined; i += 1) {
        delete obj[i];
    }

    obj.length = al;
}


module.exports = function (fQuery) {

    fQuery.fn.get = function (idx) {

        if (!fQuery._.isNumber(idx)) {
            return Array.prototype.slice.call(this);
        }

        return idx < 0 ? this[this.length + idx] : this[idx];
    };

    fQuery.fn.each = function (fn) {

        Array.prototype.forEach.call(this, function (blob, idx) {

            fn.call(this, blob, idx);
        }, this);

        return this;
    };

    fQuery.fn.map = function (fn) {

        return Array.prototype.map.call(this, function (blob, idx) {

            return fn.call(this, blob, idx);
        }, this);
    };

    fQuery.fn.push = function (blobs) {

        if (blobs instanceof fQuery) {
            blobs = blobs.get();
        }
        if (!fQuery._.isArray(blobs)) {
            blobs = [blobs];
        }

        blobs = blobs.filter(function (blob) { return blob instanceof fQuery.Blob; });

        if (!this._stack) {
            this._stack = [];
        }

        this._stack.unshift(blobs);
        publish(this, this._stack[0]);
        return this;
    };

    fQuery.fn.pop = function () {

        if (!this._stack) {
            this._stack = [];
        }

        this._stack.shift();

        if (!this._stack.length) {
            this._stack.push([]);
        }

        publish(this, this._stack[0]);
        return this;
    };

    fQuery.fn.thenPush = function (blobs) {

        return this.then(function () {

            this.push(blobs);
        });
    };

    fQuery.fn.thenPop = function () {

        return this.then(function () {

            this.pop();
        });
    };
};
