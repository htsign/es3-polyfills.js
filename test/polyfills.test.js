require('../js/polyfills');

describe('polyfills.js', () => {
  describe('Object static members', () => {
    const o = { a: 1, b: 2 };
    test('Object.keys', () => {
      expect(Object.keys(o)).toEqual(['a', 'b']);
    });
    test('Object.values', () => {
      expect(Object.values(o)).toEqual([1, 2]);
    });
    test('Object.entries', () => {
      expect(Object.entries(o)).toEqual([['a', 1], ['b', 2]]);
    });
    test('Object.fromEntries', () => {
      expect(Object.fromEntries([['a', 1], ['b', 2]])).toEqual(o);
    });

    const o2 = { ...o };
    const exp = { a: 1, b: 2, c: 3 };
    test('Object.assign', () => {
      expect(Object.assign(o2, { c: 3 })).toEqual(exp);
    });
    test('Object.assign has side effect', () => {
      expect(o2).toEqual(exp);
    });
  });

  describe('Function prototype members', () => {
    test('Function.prototype.bind', () => {
      expect((function () { return this }).bind({ a: 1 })()).toEqual({ a: 1 });

      const f = function () { return Array.prototype.slice.call(arguments) };
      const g = f.bind(undefined, 1, 2);
      expect(g(3, 4, 5)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('Array prototype members', () => {
    test('Array.prototype.map', () => {
      expect([1, 2, 3].map(x => x + 1)).toEqual([2, 3, 4]);
    });
    test('Array.prototype.filter', () => {
      expect([1, 2, 3, 4, 5].filter(x => x % 2)).toEqual([1, 3, 5]);
    });
    test('Array.prototype.forEach', () => {
      const exp = [];
      [1, 2, 3].forEach(x => exp.push(x));
      expect(exp).toEqual([1, 2, 3]);
    });
    test('Array.prototype.every', () => {
      expect([2, 4, 6, 8].every(x => x % 2 === 0)).toBeTruthy();
      expect([2, 4, 5, 8].every(x => x & 2 === 0)).toBeFalsy();
    });
    test('Array.prototype.some', () => {
      expect([1, 3, 5, 7].some(x => x % 2 === 0)).toBeFalsy();
      expect([1, 3, 6, 7].some(x => x % 2 === 0)).toBeTruthy();
    });
    test('Array.prototype.reduce', () => {
      expect([2, 4, 6, 8].reduce((acc, cur, i) => i % 2 === 0 ? acc - cur : acc + cur, 100)).toEqual(104);
      expect([[0, 1], [2, 3], [4, 5]].reduce((acc, cur) => acc.concat(cur))).toEqual([0, 1, 2, 3, 4, 5]);
    });
    test('Array.prototype.reduceRight', () => {
      expect([2, 4, 6, 8].reduceRight((acc, cur, i) => i % 2 === 0 ? acc - cur : acc + cur, 100)).toEqual(104);
      expect([[0, 1], [2, 3], [4, 5]].reduceRight((acc, cur) => acc.concat(cur))).toEqual([4, 5, 2, 3, 0, 1]);
    });
    test('Array.prototype.find', () => {
      expect(['abc', 'def', 'ghi'].find(s => s.includes('e'))).toEqual('def');
    });
    test('Array.prototype.indexOf', () => {
      expect([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].indexOf(3)).toEqual(2);
      expect([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].indexOf(3, 3)).toEqual(7);
      expect([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].indexOf(3, 8)).toEqual(-1);
    });
    test('Array.prototype.includes', () => {
      expect([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].includes(3)).toBeTruthy();
      expect([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].includes(3, 3)).toBeTruthy();
      expect([1, 2, 3, 4, 5, 1, 2, 3, 4, 5].includes(3, 8)).toBeFalsy();
    });
    test('Array.prototype.flat', () => {
      const arr = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
      expect(arr.flat()).toEqual(arr.flat(1));
      expect(arr.flat(1)).toEqual([1, 2, 3, 4, [5, 6, [7, 8, [9, 10]]]]);
      expect(arr.flat(2)).toEqual([1, 2, 3, 4, 5, 6, [7, 8, [9, 10]]]);
      expect(arr.flat(Infinity)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(arr.flat(0)).toEqual(arr);
    });
    test('Array.prototype.flatMap', () => {
      expect([1, 2, 3, 4].flatMap(x => [x, x * 2])).toEqual([1, 2, 2, 4, 3, 6, 4, 8]);
    });
  });
});

