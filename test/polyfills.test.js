require('../js/polyfills');

const { suite, test } = require('node:test');
const assert = require('node:assert/strict');

suite('polyfills.js', () => {
  suite('Object static members', () => {
    const o = { a: 1, b: 2 };
    test('Object.keys', () => {
      assert.deepStrictEqual(Object.keys(o), ['a', 'b']);
    });
    test('Object.values', () => {
      assert.deepStrictEqual(Object.values(o), [1, 2]);
    });
    test('Object.entries', () => {
      assert.deepStrictEqual(Object.entries(o), [['a', 1], ['b', 2]]);
    });
    test('Object.fromEntries', () => {
      assert.deepStrictEqual(Object.fromEntries([['a', 1], ['b', 2]]), o);
    });

    const o2 = { ...o };
    const exp = { a: 1, b: 2, c: 3 };
    test('Object.assign', () => {
      assert.deepStrictEqual(Object.assign(o2, { c: 3 }), exp);
    });
    test('Object.assign has side effect', () => {
      assert.deepStrictEqual(o2, exp);
    });
  });

  suite('Function prototype members', () => {
    test('Function.prototype.bind', t => {
      t.test('binds this', () => {
        assert.deepStrictEqual((function () { return this }).bind({ a: 1 })(), { a: 1 });
      });

      t.test('partial application', () => {
        const f = function () { return Array.prototype.slice.call(arguments) };
        const g = f.bind(undefined, 1, 2);
        assert.deepStrictEqual(g(3, 4, 5), [1, 2, 3, 4, 5]);
      });
    });
  });

  suite('Array prototype members', () => {
    test('Array.prototype.map', () => {
      assert.deepStrictEqual([1, 2, 3].map(x => x + 1), [2, 3, 4]);
    });
    test('Array.prototype.filter', () => {
      assert.deepStrictEqual([1, 2, 3, 4, 5].filter(x => x % 2), [1, 3, 5]);
    });
    test('Array.prototype.forEach', () => {
      const exp = [];
      [1, 2, 3].forEach(x => exp.push(x));
      assert.deepStrictEqual(exp, [1, 2, 3]);
    });
    test('Array.prototype.every', t => {
      t.test('true case', () => {
        assert.ok([2, 4, 6, 8].every(x => x % 2 === 0));
      });
      t.test('false case', () => {
        assert.strictEqual([2, 4, 5, 8].every(x => x & 2 === 0), false);
      });
    });
    test('Array.prototype.some', t => {
      t.test('false case', () => {
        assert.strictEqual([1, 3, 5, 7].some(x => x % 2 === 0), false);
      });
      t.test('true case', () => {
        assert.ok([1, 3, 6, 7].some(x => x % 2 === 0));
      });
    });
    test('Array.prototype.reduce', t => {
      t.test('calc', () => {
        assert.deepStrictEqual([2, 4, 6, 8].reduce((acc, cur, i) => i % 2 === 0 ? acc - cur : acc + cur, 100), 104);
      });
      t.test('concat', () => {
        assert.deepStrictEqual([[0, 1], [2, 3], [4, 5]].reduce((acc, cur) => acc.concat(cur)), [0, 1, 2, 3, 4, 5]);
      });
    });
    test('Array.prototype.reduceRight', t => {
      t.test('calc', () => {
        assert.deepStrictEqual([2, 4, 6, 8].reduceRight((acc, cur, i) => i % 2 === 0 ? acc - cur : acc + cur, 100), 104);
      });
      t.test('concat', () => {
        assert.deepStrictEqual([[0, 1], [2, 3], [4, 5]].reduceRight((acc, cur) => acc.concat(cur)), [4, 5, 2, 3, 0, 1]);
      });
    });
    test('Array.prototype.find', t => {
      t.test('found', () => {
        assert.strictEqual(['abc', 'def', 'ghi'].find(s => s.includes('e')), 'def');
      });
      t.test('not found', () => {
        assert.strictEqual(['abc', 'def', 'ghi'].find(s => s.includes('z')), undefined);
      });
    });
    test('Array.prototype.indexOf', t => {
      t.test('found', () => {
        assert.deepStrictEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].indexOf(3), 2);
      });
      t.test('found with fromIndex', () => {
        assert.deepStrictEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].indexOf(3, 3), 7);
      });
      t.test('not found', () => {
        assert.deepStrictEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].indexOf(3, 8), -1);
      });
    });
    test('Array.prototype.includes', t => {
      t.test('found', () => {
        assert.ok([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].includes(3));
      });
      t.test('found with fromIndex', () => {
        assert.ok([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].includes(3, 3));
      });
      t.test('not found', () => {
        assert.strictEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].includes(3, 8), false);
      });
    });
    test('Array.prototype.flat', t => {
      const arr = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
      t.test('default depth', () => {
        assert.deepStrictEqual(arr.flat(1), [1, 2, 3, 4, [5, 6, [7, 8, [9, 10]]]]);
        assert.deepStrictEqual(arr.flat(), arr.flat(1));
      });
      t.test('depth 2', () => {
        assert.deepStrictEqual(arr.flat(2), [1, 2, 3, 4, 5, 6, [7, 8, [9, 10]]]);
      });
      t.test('Infinity', () => {
        assert.deepStrictEqual(arr.flat(Infinity), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
      t.test('depth 0', () => {
        assert.deepStrictEqual(arr.flat(0), arr);
      });
    });
    test('Array.prototype.flatMap', () => {
      assert.deepStrictEqual([1, 2, 3, 4].flatMap(x => [x, x * 2]), [1, 2, 2, 4, 3, 6, 4, 8]);
    });
  });

  suite('Array static members', () => {
    test('Array.from', t => {
      t.test('from string', () => {
        assert.deepStrictEqual(Array.from('foo'), ['f', 'o', 'o']);
      });
      t.test('with map function', () => {
        assert.deepStrictEqual(Array.from([1, 2, 3], x => x + x), [2, 4, 6]);
      });
    });
    test('Array.of', t => {
      t.test('single arg', () => {
        assert.deepStrictEqual(Array.of(1), [1]);
      });
      t.test('multiple args', () => {
        assert.deepStrictEqual(Array.of(1, 2, 3), [1, 2, 3]);
      });
      t.test('undefined arg', () => {
        assert.deepStrictEqual(Array.of(undefined), [undefined]);
      });
    });
  });

  suite('String prototype members', () => {
    test('String.prototype.trim', () => {
      assert.strictEqual('  Hello World!  '.trim(), 'Hello World!');
    });
    test('String.prototype.trimStart', () => {
      assert.strictEqual('  Hello World!  '.trimStart(), 'Hello World!  ');
    });
    test('String.prototype.trimEnd', () => {
      assert.strictEqual('  Hello World!  '.trimEnd(), '  Hello World!');
    });
    test('String.prototype.startsWith', t => {
      t.test('basic', () => {
        assert.strictEqual('Saturday night plans'.startsWith('Sat'), true);
      });
      t.test('with position', () => {
        assert.strictEqual('Saturday night plans'.startsWith('Sat', 0), true);
        assert.strictEqual('Saturday night plans'.startsWith('Sat', 3), false);
        assert.strictEqual('Saturday night plans'.startsWith('urday', 3), true);
      });
      t.test('type conversion', () => {
        assert.strictEqual('Saturday night plans'.startsWith('urday', '3'), true);
        assert.strictEqual('Saturday night plans'.startsWith('Sat', 0.9), true);
        assert.strictEqual('Saturday night plans'.startsWith('Sat', NaN), true);
      });
    });
    test('String.prototype.endsWith', t => {
      t.test('basic', () => {
        assert.strictEqual('Cats are the best!'.endsWith('best!'), true);
      });
      t.test('with position', () => {
        assert.strictEqual('Cats are the best!'.endsWith('best', 17), true);
        assert.strictEqual('Cats are the best!'.endsWith('best', 18), false);
      });
      t.test('type conversion', () => {
        assert.strictEqual('Cats are the best!'.endsWith('best', '17'), true);
        assert.strictEqual('Cats are the best!'.endsWith('best', 17.9), true);
        assert.strictEqual('Cats are the best!'.endsWith('Cats', NaN), false);
      });
    });
    test('String.prototype.includes', t => {
      t.test('true case', () => {
        assert.strictEqual('Blue Whale'.includes('Blue'), true);
      });
      t.test('false case', () => {
        assert.strictEqual('Blue Whale'.includes('blue'), false);
      });
    });
    test('String.prototype.padStart', t => {
      t.test('pad with 0', () => {
        assert.strictEqual('5'.padStart(2, '0'), '05');
      });
      t.test('pad with 0 (longer)', () => {
        assert.strictEqual('5'.padStart(4, '0'), '0005');
      });
    });
    test('String.prototype.padEnd', t => {
      t.test('pad with char', () => {
        assert.strictEqual('Breaded Mushrooms'.padEnd(25, '.'), 'Breaded Mushrooms........');
      });
      t.test('pad with space (default)', () => {
        assert.strictEqual('200'.padEnd(5), '200  ');
      });
    });
    test('String.prototype.repeat', t => {
      t.test('repeat 3 times', () => {
        assert.strictEqual('chorus'.repeat(3), 'choruschoruschorus');
      });
      t.test('repeat 0 times', () => {
        assert.strictEqual('chorus'.repeat(0), '');
      });
    });
  });
});
