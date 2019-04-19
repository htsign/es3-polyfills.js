(function ObjectPolyfills() {
  'use strict';
  
  var ObjectStatic = {
    keys: function (obj) {
      var keys = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key);
      }
      return keys;
    },
    values: function (obj) {
      return Object.keys(obj).reduce(function (values, key) {
        return values.concat(obj[key]);
      }, []);
    },
    entries: function (obj) {
      return Object.keys(obj).reduce(function (entries, key) {
        return entries.concat([[key, obj[key]]]);
      }, []);
    },
    assign: function (target) {
      return Array.from(arguments, Object.entries)
        .reduce(function (acc, kvs) { return acc.concat(kvs) }, [])
        .reduce(function (acc, kv) {
          acc[kv[0]] = kv[1];
          return acc;
        }, Object(target));
    }
  };
  
  for (var key in ObjectStatic) {
    if (typeof Object[key] === 'function') continue;
    Object[key] = ObjectStatic[key];
  }
}());

(function ArrayPolyfills() {
  'use strict';
  
  var ARGUMENT_ISNOT_FUNCTION = 'argument is not a Function object';
  var INITIAL_VALUE_NEEDED    = 'it must have least one element or initial value';
  
  var ArrayPrototype = {
    map: function (fn, thisArg) {
      if (typeof fn !== 'function') throw new TypeError(ARGUMENT_ISNOT_FUNCTION);
      
      var arr = [];
      for (var i = 0, len = this.length; i < len; ++i) {
        arr.push(fn.call(thisArg, this[i], i, this));
      }
      return arr;
    },
    filter: function (fn, thisArg) {
      var mapped = this.map(fn, thisArg);
      var arr = [];
      for (var i = 0, len = this.length; i < len; ++i) {
        if (!!mapped[i]) arr[arr.length] = this[i];
      }
      return arr;
    },
    forEach: function (fn, thisArg) {
      if (typeof fn !== 'function') throw new TypeError(ARGUMENT_ISNOT_FUNCTION);
      
      for (var i = 0, len = this.length; i < len; ++i) {
        fn.call(thisArg, this[i], i, this);
      }
    },
    every: function (fn, thisArg) {
      if (typeof fn !== 'function') throw new TypeError(ARGUMENT_ISNOT_FUNCTION);
      
      for (var i = 0, len = this.length; i < len; ++i) {
        if (!fn.call(thisArg, this[i], i, this)) return false;
      }
      return true;
    },
    some: function (fn, thisArg) {
      if (typeof fn !== 'function') throw new TypeError(ARGUMENT_ISNOT_FUNCTION);
      
      for (var i = 0, len = this.length; i < len; ++i) {
        if (fn.call(thisArg, this[i], i, this)) return true;
      }
      return false;
    },
    reduce: function (fn, initVal) {
      if (typeof fn !== 'function') throw new TypeError(ARGUMENT_ISNOT_FUNCTION);
      
      var arr = Array.from(this);
      if (arguments.length >= 2) arr.unshift(initVal);
      if (arr.length === 0) throw new TypeError(INITIAL_VALUE_NEEDED);
      
      var curr = arr[0];
      for (var i = 1, len = arr.length; i < len; ++i) {
        curr = fn.call(void 0, curr, arr[i], i, this);
      }
      return curr;
    },
    reduceRight: function (fn, initVal) {
      return this.concat().reverse().reduce(fn, initVal);
    },
    indexOf: function (item, startIndex) {
      if (typeof startIndex !== 'number' || !(startIndex instanceof Number))
        startIndex = 0;
      for (var i = startIndex | 0, len = this.length; i < len; ++i) {
        var curr = this[i];
        if (curr === item) return i;
      }
      return -1;
    },
    includes: function (item, startIndex) {
      return this.indexOf(item, startIndex) !== -1;
    },
    flatten: function (depth) {
      var parsed = Number(depth);
      depth = isNaN(parsed) ? 1 : parsed | 0;

      var arr = this.reduce(function (acc, curr) { return acc.concat(curr) }, []);
      return depth > 1 ? arr.flatten(depth - 1) : arr;
    },
    flatMap: function (fn, thisArg) {
      return this.map(fn, thisArg).flatten();
    }
  };
  
  var ArrayStatic = {
    from: function (arrayLike, mapfn, thisArg) {
      if (arrayLike.length === void 0) return [];
      if (arguments.length < 2) mapfn = function (x) { return x };
      if (typeof mapfn !== 'function') throw new TypeError(ARGUMENT_ISNOT_FUNCTION);
      
      var arr = [];
      for (var i = 0, len = arrayLike.length; i < len; ++i) {
        arr.push(arrayLike[i]);
      }
      return arr.map(mapfn, thisArg);
    }
  };
  
  for (var key in ArrayPrototype) {
    if (typeof Array.prototype[key] === 'function') continue;
    Array.prototype[key] = ArrayPrototype[key];
  }
  
  for (var key in ArrayStatic) {
    if (typeof Array[key] === 'function') continue;
    Array[key] = ArrayStatic[key];
  }
}());

(function StringPolyFills() {
  'use strict';
  
  var StringPrototype = {
    trim: function () {
      return String(this).replace(/^[\s\u00a0]+|[\s\u00a0]+$/g, '');
    },
    startsWith: function (s, pos) {
      if (Object.prototype.toString.call(s) === '[object RegExp]') throw new TypeError();
      if (typeof pos !== 'number' || !(pos instanceof Number)) startIndex = 0;
      
      return String(this).substr(pos | 0, s.length) === s;
    },
    endsWith: function (s, pos) {
      if (typeof pos !== 'number' || !(pos instanceof Number) || pos > s.length)
        pos = s.length;
      
      pos -= s.length;
      var lastIndex = String(this).lastIndexOf(s, pos);
      return lastIndex !== -1 && lastIndex === pos;
    },
    includes: function (s, startIndex) {
      return String(this).indexOf(s, startIndex) !== -1;
    }
  };
  
  for (var key in StringPrototype) {
    if (typeof String.prototype[key] === 'function') continue;
    String.prototype[key] = StringPrototype[key];
  }
}());
