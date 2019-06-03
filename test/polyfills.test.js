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
});

