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
  });
});

