require('../js/polyfills');

describe('polyfills.js', () => {
  test('Object.keys', () => {
    expect(Object.keys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });
});

