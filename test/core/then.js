const _ = require('lodash');
const {test, assert} = require('scar');

const fQuery = require('../../lib/fQuery');

test('fQuery.fn.then() is function', () => {
    assert.ok(_.isFunction(fQuery.fn.then));
});

test('fQuery.fn.then() expectes 1 parameter', () => {
    assert.equal(fQuery.fn.then.length, 1);
});

test('fQuery.fn.then() works with no parameter', () => {
    fQuery().then();
});

test('fQuery.fn.then() returns this, is chainable', () => {
    const x = fQuery();
    const y = x.then();
    const z = y.then();
    assert.equal(x, y);
    assert.equal(y, z);
});

test('fQuery.fn.then() then calls are in order', () => {
    const list = [0];

    fQuery()
        .then(() => {
            list.push(1);
            assert.deepEqual(list, [0, 1]);
        })
        .then(() => {
            list.push(2);
            assert.deepEqual(list, [0, 1, 2]);
        })
        .then(() => {
            list.push(3);
            assert.deepEqual(list, [0, 1, 2, 3]);
        });

    setTimeout(() => {
        assert.deepEqual(list, [0, 1, 2, 3]);
    }, 0);

    assert.deepEqual(list, [0]);
});


test('fQuery.fn.isPending() is function', () => {
    assert.ok(_.isFunction(fQuery.fn.isPending));
});

test('fQuery.fn.isPending() expectes no parameters', () => {
    assert.equal(fQuery.fn.isPending.length, 0);
});

test('fQuery.fn.isPending() false for new object', () => {
    let x = fQuery();
    assert.equal(x.isPending(), false);

    x = fQuery('test/assets/files-abc/*');
    assert.equal(x.isPending(), false);
});

test('fQuery.fn.isPending() true after call for then', () => {
    const x = fQuery().then();
    assert.equal(x.isPending(), true);
});

test('fQuery.fn.isPending() true inside then', () => {
    return new Promise(resolve => {
        const x = fQuery().then(() => {
            assert.equal(x.isPending(), true);
            resolve();
        });
    });
});

test('fQuery.fn.isPending() false after then is done', () => {
    return new Promise(resolve => {
        const x = fQuery().then(() => {
            setTimeout(afterThen, 0); // eslint-disable-line
        });
        const afterThen = () => {
            assert.equal(x.isPending(), false);
            resolve();
        };
    });
});

test('fQuery.fn.isPending() correct in all phases', () => {
    return new Promise(resolve => {
        const x = fQuery();
        const afterThen = () => {
            assert.equal(x.isPending(), false);
            resolve();
        };

        assert.equal(x.isPending(), false);

        x.then(() => {
            assert.equal(x.isPending(), true);
            setTimeout(afterThen, 0);
            assert.equal(x.isPending(), true);
        });

        assert.equal(x.isPending(), true);
    });
});
