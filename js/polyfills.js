(function () {
  var runOnBrowser = (function () {
    try {
      global;
      return false;
    }
    catch (e) {
      return true;
    }
  }());

  // Object methods
  // - keys(obj: {}) => string[]
  // - values(obj: {}) => any[]
  // - entries(obj: {}) => { [key: string]: any }
  // - fromEntries(iterable: [any, any][]) => {}
  // - assign(obj: {}) => {}
  (function ObjectPolyfills() {
    'use strict';

    var transformObjectInternal = function (iterable, base) {
      return Array.prototype.reduce.call(iterable, function (acc, kv) {
        acc[kv[0]] = kv[1];
        return acc;
      }, base);
    };

    var ObjectStatic = {
      keys: function (obj) {
        var keys = [];
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key);
        }
        return keys;
      },
      values: function (obj) {
        return Object.keys(obj).map(function (key) { return obj[key] });
      },
      entries: function (obj) {
        return Object.keys(obj).map(function (key) { return [key, obj[key]] });
      },
      fromEntries: function (iterable) {
        return transformObjectInternal(iterable, {});
      },
      assign: function (target) {
        var entries = Array.prototype.flatMap.call(arguments, Object.entries);
        return transformObjectInternal(entries, Object(target));
      }
    };

    for (var key in ObjectStatic) {
      if (runOnBrowser && typeof Object[key] === 'function') continue;
      Object[key] = ObjectStatic[key];
    }
  }());

  // Function prototype methods
  // - bind(thisArg: any, ...args: any[]) => Function
  (function FunctionPolyfills() {
    'use strict';

    var FunctionPrototype = {
      bind: function (thisArg) {
        var that = this;
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
          return that.apply(thisArg, args.concat(Array.prototype.slice.call(arguments)));
        };
      }
    };

    for (var key in FunctionPrototype) {
      if (runOnBrowser && typeof Function.prototype[key] === 'function') continue;
      Function.prototype[key] = FunctionPrototype[key];
    }
  }());

  // Array methods
  // - from<T, U>(arrayLike: ArrayLike<T>, mapfn: (value: T) => U, thisArg: any) => U[]
  // - of<T>(...items: T[]) => T[]
  // Array prototype methods
  // - map<T, U>(fn: (value: T, index: number, array: T[]) => U, thisArg: any) => U[]
  // - filter<T>(fn: (value: T, index: number, array: T[]) => any, thisArg: any) => T[]
  // - forEach<T>(fn: (value: T, index: number, array: T[]) => any, thisArg: any) => void
  // - every<T>(fn: (value: T, index: number, array: T[]) => any, thisArg: any) => boolean
  // - some<T>(fn: (value: T, index: number, array: T[]) => any, thisArg: any) => boolean
  // - reduce<T, U>(fn: (accumulator: U, value: T, index: number, array: T[]) => U, initVal: U) => U
  // - reduceRight<T, U>(fn: (accumulator: U, value: T, index: number, array: T[]) => U, initVal: U) => U
  // - find<T>(fn: (value: T, index: number, array: T[]) => any, thisArg: any) => T
  // - indexOf<T>(item: T, startIndex: number) => number
  // - includes<T>(item: T, startIndex: number) => boolean
  // - flat<T>(depth: number) => T[]
  // - flatMap<T, U>(fn: (value: T, index: number, array: T[]) => U[], thisArg: any) => U[]
  (function ArrayPolyfills() {
    'use strict';

    var ARGUMENT_ISNOT_FUNCTION = 'TypeError: argument is not a Function object';
    var INITIAL_VALUE_NEEDED    = 'TypeError: it must have least one element or initial value';

    var getItem = function (source, i) {
      if (Object.prototype.toString.call(source).slice(8, -1) === 'String') return source.charAt(i);
      if (i in source) return source[i];

      if ('item' in source && ['object', 'function', 'unknown'].includes(typeof source.item)) {
        try {
          return source.item(i);
        }
        catch (e) { }
      }
      return void 0;
    };

    var ArrayPrototype = {
      map: function (fn, thisArg) {
        if (typeof fn !== 'function') throw new Error(ARGUMENT_ISNOT_FUNCTION);

        return Array.prototype.reduce.call(this, function (acc, curr, i, arr) {
          return acc.concat([fn.call(thisArg, curr, i, arr)]);
        }, []);
      },
      filter: function (fn, thisArg) {
        if (typeof fn !== 'function') throw new Error(ARGUMENT_ISNOT_FUNCTION);

        return Array.prototype.reduce.call(this, function (acc, curr, i, arr) {
          return fn.call(thisArg, curr, i, arr) ? acc.concat([curr]) : acc;
        }, []);
      },
      forEach: function (fn, thisArg) {
        if (typeof fn !== 'function') throw new Error(ARGUMENT_ISNOT_FUNCTION);

        for (var i = 0, len = this.length; i < len; ++i) {
          fn.call(thisArg, getItem(this, i), i, this);
        }
      },
      every: function (fn, thisArg) {
        if (typeof fn !== 'function') throw new Error(ARGUMENT_ISNOT_FUNCTION);

        return Array.prototype.reduce.call(this, function (acc, curr, i, arr) {
          return acc && fn.call(thisArg, curr, i, arr);
        }, true);
      },
      some: function (fn, thisArg) {
        if (typeof fn !== 'function') throw new Error(ARGUMENT_ISNOT_FUNCTION);

        return Array.prototype.reduce.call(this, function (acc, curr, i, arr) {
          return acc || fn.call(thisArg, curr, i, arr);
        }, false);
      },
      reduce: function (fn, initVal) {
        if (typeof fn !== 'function') throw new Error(ARGUMENT_ISNOT_FUNCTION);

        var arr = [];
        for (var i = 0, len = this.length; i < len; ++i) {
          arr.push(getItem(this, i));
        }
        if (arguments.length >= 2) arr.unshift(initVal);
        if (arr.length === 0) throw new Error(INITIAL_VALUE_NEEDED);

        var curr = arr[0];
        for (var i = 1, len = arr.length; i < len; ++i) {
          curr = fn.call(void 0, curr, arr[i], i - 1, this);
        }
        return curr;
      },
      reduceRight: function (fn, initVal) {
        return Array.from(this).reverse().reduce(fn, initVal);
      },
      find: function (fn, thisArg) {
        if (typeof fn !== 'function') throw new Error(ARGUMENT_ISNOT_FUNCTION);

        for (var i = 0, len = this.length; i < len; ++i) {
          var value = getItem(this, i);
          if (fn.call(thisArg, value, i, this)) return value;
        }
        return void 0;
      },
      indexOf: function (item, startIndex) {
        if (typeof startIndex !== 'number' || !(startIndex instanceof Number))
          startIndex = 0;
        for (var i = startIndex | 0, len = this.length; i < len; ++i) {
          var curr = getItem(this, i);
          if (curr === item) return i;
        }
        return -1;
      },
      includes: function (item, startIndex) {
        return Array.prototype.indexOf.call(this, item, startIndex) !== -1;
      },
      flat: function (depth) {
        var parsed = Number(depth);
        depth = isNaN(parsed) ? 1 : parsed | 0;

        var arr = Array.prototype.reduce.call(this, function (acc, curr) {
          return acc.concat(curr);
        }, []);
        return depth > 1 ? arr.flat(depth - 1) : arr;
      },
      flatMap: function (fn, thisArg) {
        return Array.prototype.map.call(this, fn, thisArg).flat();
      }
    };

    var ArrayStatic = {
      from: function (arrayLike, mapfn, thisArg) {
        if (arrayLike.length === void 0) return [];
        if (arguments.length < 2) mapfn = function (x) { return x };
        if (typeof mapfn !== 'function') throw new Error(ARGUMENT_ISNOT_FUNCTION);

        var arr = [];
        for (var i = 0, len = arrayLike.length; i < len; ++i) {
          arr.push(getItem(arrayLike, i));
        }
        return arr.map(mapfn, thisArg);
      },
      of: function () {
        return Array.from(arguments);
      }
    };

    for (var key in ArrayPrototype) {
      if (runOnBrowser && typeof Array.prototype[key] === 'function') continue;
      Array.prototype[key] = ArrayPrototype[key];
    }

    for (var key in ArrayStatic) {
      if (runOnBrowser && typeof Array[key] === 'function') continue;
      Array[key] = ArrayStatic[key];
    }
  }());

  // String prototype methods
  // - trim() => string
  // - trimStart() => string
  // - trimEnd() => string
  // - startsWith(s: string, pos: number) => boolean
  // - endsWith(s: string, pos: number) => boolean
  // - includes(s: string, startIndex: number) => boolean
  // - padStart(length: number, padString: string) => string
  // - padEnd(length: number, padString: string) => string
  // - repeat(count) => string
  (function StringPolyFills() {
    'use strict';

    var padInternal = function (s, length, padString) {
      padString = padString != null ? String(padString) : ' ';

      var restLength = length - s.length;
      if (restLength < 0) return '';

      var repeatCount = Math.ceil(restLength / padString.length);
      return padString.repeat(repeatCount).slice(0, restLength);
    };

    var StringPrototype = {
      trim: function () {
        return String(this).replace(/^[\s\u00a0]+|[\s\u00a0]+$/g, '');
      },
      trimStart: function () {
        return String(this).replace(/^[\s\u00a0]+/g, '');
      },
      trimEnd: function () {
        return String(this).replace(/[\s\u00a0]+$/g, '');
      },
      startsWith: function (s, pos) {
        if (Object.prototype.toString.call(s) === '[object RegExp]') throw new Error('TypeError');

        pos = !pos || pos < 0 ? 0 : +pos;
        return String(this).substr(pos | 0, pos + s.length) === s;
      },
      endsWith: function (s, pos) {
        if (typeof pos !== 'number' || !(pos instanceof Number) || pos > this.length)
          pos = this.length;

        return String(this).substr(pos - s.length, pos | 0) === s;
      },
      includes: function (s, startIndex) {
        return String(this).indexOf(s, startIndex) !== -1;
      },
      padStart: function (length, padString) {
        var s = String(this);
        return padInternal(s, length, padString) + s;
      },
      padEnd: function (length, padString) {
        var s = String(this);
        return s + padInternal(s, length, padString);
      },
      repeat: function (count) {
        count = Number(count) | 0;
        if (count < 0) throw new Error('RangeError: repeat count must be non-negative');
        return Array.from({ length: count + 1 }).join(this);
      }
    };

    for (var key in StringPrototype) {
      if (runOnBrowser && typeof String.prototype[key] === 'function') continue;
      String.prototype[key] = StringPrototype[key];
    }
  }());
}());
