const _ = require('lodash');
const assert = require('assert');

const fQuery = require('../../lib/fQuery');

/* globals describe it */

describe('fQuery.fn.then()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.then));
    });

    it('expectes 1 parameter', () => {
        assert.strictEqual(fQuery.fn.then.length, 1);
    });

    it('works with no parameter', () => {
        fQuery().then();
    });

    it('returns this, is chainable', () => {
        const x = fQuery();
        const y = x.then();
        const z = y.then();
        assert.strictEqual(x, y);
        assert.strictEqual(y, z);
    });

    it('then calls are in order', () => {
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
});


describe('fQuery.fn.isPending()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.isPending));
    });

    it('expectes no parameters', () => {
        assert.strictEqual(fQuery.fn.isPending.length, 0);
    });

    it('false for new object', () => {
        let x = fQuery();
        assert.strictEqual(x.isPending(), false);

        x = fQuery('test/assets/files-abc/*');
        assert.strictEqual(x.isPending(), false);
    });

    it('true after call for then', () => {
        const x = fQuery().then();
        assert.strictEqual(x.isPending(), true);
    });

    it('true inside then', done => {
        const x = fQuery().then(() => {
            assert.strictEqual(x.isPending(), true);
            done();
        });
    });

    it('false after then is done', done => {
        const x = fQuery().then(() => {
            setTimeout(afterThen, 0); // eslint-disable-line
        });
        const afterThen = () => {
            assert.strictEqual(x.isPending(), false);
            done();
        };
    });

    it('correct in all phases', done => {
        const x = fQuery();
        const afterThen = () => {
            assert.strictEqual(x.isPending(), false);
            done();
        };

        assert.strictEqual(x.isPending(), false);

        x.then(() => {
            assert.strictEqual(x.isPending(), true);
            setTimeout(afterThen, 0);
            assert.strictEqual(x.isPending(), true);
        });

        assert.strictEqual(x.isPending(), true);
    });
});
