const {is_num, is_arr} = require('../util/misc');


const publish = (obj, array) => {
    array = array || [];

    const ol = obj.length;
    const al = array.length;

    for (let i = 0; i < al; i += 1) {
        obj[i] = array[i];
    }
    for (let i = al; i < ol || obj[i] !== undefined; i += 1) {
        Reflect.deleteProperty(obj, String(i));
    }

    obj.length = al;
};


module.exports = fQuery => {
    fQuery.fn.get = function fn2(idx) {
        if (!is_num(idx)) {
            return Array.from(this);
        }

        return idx < 0 ? this[this.length + idx] : this[idx];
    };

    fQuery.fn.each = function fn2(fn) {
        Array.from(this).forEach((blob, idx) => {
            Reflect.apply(fn, this, [blob, idx]);
        });

        return this;
    };

    fQuery.fn.map = function fn2(fn) {
        return Array.from(this, (blob, idx) => {
            return Reflect.apply(fn, this, [blob, idx]);
        });
    };

    fQuery.fn.push = function fn2(blobs) {
        if (blobs instanceof fQuery) {
            blobs = blobs.get();
        }
        if (!is_arr(blobs)) {
            blobs = [blobs];
        }

        blobs = blobs.filter(blob => blob instanceof fQuery.Blob);

        if (!this._stack) {
            this._stack = [];
        }

        this._stack.unshift(blobs);
        publish(this, this._stack[0]);
        return this;
    };

    fQuery.fn.pop = function fn2() {
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

    fQuery.fn.thenPush = function fn2(blobs) {
        return this.then(function fn3() {
            this.push(blobs);
        });
    };

    fQuery.fn.thenPop = function fn2() {
        return this.then(function fn3() {
            this.pop();
        });
    };
};
