/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

var Symbol = root.Symbol;

var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var asyncTag = '[object AsyncFunction]';
var funcTag$1 = '[object Function]';
var genTag$1 = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}

var coreJsData = root['__core-js_shared__'];

var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var Map = getNative(root, 'Map');

var nativeCreate = getNative(Object, 'create');

function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$4.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var argsTag$1 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$1;
}

var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$6.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var funcTag$2 = '[object Function]';
var mapTag$1 = '[object Map]';
var numberTag$1 = '[object Number]';
var objectTag$1 = '[object Object]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$1 = '[object String]';
var weakMapTag$1 = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';
var float32Tag$1 = '[object Float32Array]';
var float64Tag$1 = '[object Float64Array]';
var int8Tag$1 = '[object Int8Array]';
var int16Tag$1 = '[object Int16Array]';
var int32Tag$1 = '[object Int32Array]';
var uint8Tag$1 = '[object Uint8Array]';
var uint8ClampedTag$1 = '[object Uint8ClampedArray]';
var uint16Tag$1 = '[object Uint16Array]';
var uint32Tag$1 = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag$1] = typedArrayTags[float64Tag$1] =
typedArrayTags[int8Tag$1] = typedArrayTags[int16Tag$1] =
typedArrayTags[int32Tag$1] = typedArrayTags[uint8Tag$1] =
typedArrayTags[uint8ClampedTag$1] = typedArrayTags[uint16Tag$1] =
typedArrayTags[uint32Tag$1] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$1] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$2] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag$1] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$5.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var nativeKeys = overArg(Object.keys, Object);

var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

function keysIn$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn$1(source), object);
}

var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$1 = moduleExports$2 ? root.Buffer : undefined;
var allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var objectProto$11 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$11.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var getPrototype = overArg(Object.getPrototypeOf, Object);

var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

var DataView = getNative(root, 'DataView');

var Promise$1 = getNative(root, 'Promise');

var Set = getNative(root, 'Set');

var WeakMap = getNative(root, 'WeakMap');

var mapTag$2 = '[object Map]';
var objectTag$2 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$2 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set);
var weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (Map && getTag(new Map) != mapTag$2) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag$2) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag$2)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$2;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/** Used for built-in method references. */
var objectProto$12 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$12.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$9.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var Uint8Array = root.Uint8Array;

function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var CLONE_DEEP_FLAG$1 = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG$1) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var CLONE_DEEP_FLAG$2 = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG$2) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

var symbolProto = Symbol ? Symbol.prototype : undefined;
var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var boolTag$2 = '[object Boolean]';
var dateTag$2 = '[object Date]';
var mapTag$3 = '[object Map]';
var numberTag$2 = '[object Number]';
var regexpTag$2 = '[object RegExp]';
var setTag$3 = '[object Set]';
var stringTag$2 = '[object String]';
var symbolTag$1 = '[object Symbol]';

var arrayBufferTag$2 = '[object ArrayBuffer]';
var dataViewTag$3 = '[object DataView]';
var float32Tag$2 = '[object Float32Array]';
var float64Tag$2 = '[object Float64Array]';
var int8Tag$2 = '[object Int8Array]';
var int16Tag$2 = '[object Int16Array]';
var int32Tag$2 = '[object Int32Array]';
var uint8Tag$2 = '[object Uint8Array]';
var uint8ClampedTag$2 = '[object Uint8ClampedArray]';
var uint16Tag$2 = '[object Uint16Array]';
var uint32Tag$2 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(object);

    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);

    case dataViewTag$3:
      return cloneDataView(object, isDeep);

    case float32Tag$2: case float64Tag$2:
    case int8Tag$2: case int16Tag$2: case int32Tag$2:
    case uint8Tag$2: case uint8ClampedTag$2: case uint16Tag$2: case uint32Tag$2:
      return cloneTypedArray(object, isDeep);

    case mapTag$3:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);

    case regexpTag$2:
      return cloneRegExp(object);

    case setTag$3:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag$1:
      return cloneSymbol(object);
  }
}

var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG$1 = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var symbolTag = '[object Symbol]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

function slugify(text) {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}
function isURL(string) {
    var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
    return pattern.test(string);
}
function isEmail(string) {
    var pattern = new RegExp(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,14}$/);
    return pattern.test(string);
}
function rgbaToHex(rgba) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(Math.floor(rgba.red() * 255)) + componentToHex(Math.floor(rgba.green() * 255)) + componentToHex(Math.floor(rgba.blue() * 255));
}
function NSrgbaToHex(rgba) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(Math.floor(rgba.redComponent() * 255)) + componentToHex(Math.floor(rgba.greenComponent() * 255)) + componentToHex(Math.floor(rgba.blueComponent() * 255));
}
function expandCSS(value) {
    var valueParts = value.split(" ");
    if (valueParts.length === 1)
        valueParts.push(valueParts[0]);
    if (valueParts.length === 2)
        valueParts.push(valueParts[0]);
    if (valueParts.length === 3)
        valueParts.push(valueParts[1]);
    return valueParts;
}
function contractCSS(values) {
    if (values[1] == values[3])
        values.splice(3, 1);
    if (values[0] == values[2] && values.length == 3)
        values.splice(2, 1);
    if (values[0] == values[1] && values.length == 2)
        values.splice(1, 1);
    return values;
}
function indent(ammount, content) {
    var indentChar = "    ";
    return "" + Array(ammount + 1).join(indentChar) + content + "\n";
}
function isCircle(layer) {
    if (layer.class() === MSShapeGroup && layer.layers().length == 1) {
        if (layer.layers()[0].class() === MSOvalShape)
            return true;
        if (layer.layers()[0].class() !== MSShapePathLayer)
            return false;
        var points = layer.layers()[0].allCurvePoints();
        if (points.length < 4)
            return false;
        var isCircle = true;
        points.forEach(function (point) {
            if (Math.round(((point.point().x - 0.5) * (point.point().x - 0.5) + (point.point().y - 0.5) * (point.point().y - 0.5)) * 100) !== 25) {
                isCircle = false;
            }
        });
        return isCircle;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=helpers.js.map

function template(bgColor, content) {
    return "<!doctype html>\n<html style=\"margin: 0; padding: 0px;\">\n<head>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\">\n    <!--[if !mso]><!-- -->\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n    <!--<![endif]-->\n    <style type=\"text/css\">\n        body{\n            margin:0;\n            padding:0;\n            line-height: 1;\n        }\n        img{\n            border:0 none;\n            height:auto;\n            line-height:100%;\n            outline:none;\n            text-decoration:none;\n            display:block;\n        }\n            a img{\n            border:0 none;\n        }\n        table, td{\n            border-collapse: collapse;\n            border-spacing: 0;\n            padding:0px;\n        }\n        #bodyTable{\n            height:100% !important;\n            margin:0;\n            padding:0;\n            width:100% !important;\n        }\n    </style>\n</head>\n<body bgcolor=\"" + bgColor + "\" style=\"padding:0px;margin:0px;\">\n    <table id=\"bodyTable\" bgcolor=\"" + bgColor + "\" style=\"width: 100%; height: 100%; background-color: " + bgColor + "; margin: 0; padding:0;\">\n        <tr>\n            <td style=\"text-align: center;\" valign=\"top\">\n    " + content + "            </td>\n        </tr>\n    </table>\n</body>\n</html>";
}
//# sourceMappingURL=layout.js.map

function convert(artboard, command) {
    var data = sketchToLayers(artboard.layers(), null, command);
    var offset = {
        minX: artboard.frame().width(),
        maxX: 0,
    };
    for (var i = data.layers.length - 1; i >= 0; i--) {
        if (data.layers[i].x1 < offset.minX)
            offset.minX = data.layers[i].x1;
        if (data.layers[i].x2 > offset.maxX)
            offset.maxX = data.layers[i].x2;
        var layer = clone(data.layers[i]);
        data.layers.splice(i, 1);
        appendLayers(data.layers, layer);
    }
    var layout = relatativePosition(data.layers, { x: 0, y: 0 });
    var table = createTable(layout, {
        width: offset.maxX,
        height: artboard.frame().height(),
        originalWidth: offset.maxX,
        originalHeight: artboard.frame().height(),
        offsetX: 0,
        offsetY: 0,
        depth: 3
    });
    var bodyBackground = rgbaToHex(artboard.backgroundColorGeneric());
    return {
        table: template(bodyBackground, table),
        assets: data.assets
    };
}
function createTable(layers, size) {
    layers = layers.sort(function (a, b) { return a.x1 - b.x1; });
    layers = layers.sort(function (a, b) { return a.y1 - b.y1; });
    layers = layers.filter(function (layer) { return (layer.x1 >= size.offsetX && layer.x2 <= size.width + size.offsetX && layer.y1 >= size.offsetY && layer.y2 <= size.height + size.offsetY); });
    if (size.offsetX || size.offsetY) {
        for (var i = 0; i < layers.length; i++) {
            layers[i].x1 -= size.offsetX;
            layers[i].x2 -= size.offsetX;
            layers[i].y1 -= size.offsetY;
            layers[i].y2 -= size.offsetY;
        }
    }
    var table = {
        columns: [0, size.width],
        rows: [0, size.height]
    };
    layers.forEach(function (layer) {
        if (table.rows.indexOf(layer.y1) < 0)
            table.rows.push(layer.y1);
        if (table.rows.indexOf(layer.y2) < 0)
            table.rows.push(layer.y2);
        if (table.columns.indexOf(layer.x1) < 0)
            table.columns.push(layer.x1);
        if (table.columns.indexOf(layer.x2) < 0)
            table.columns.push(layer.x2);
    });
    table.rows = table.rows.sort(function (a, b) { return a - b; });
    table.columns = table.columns.sort(function (a, b) { return a - b; });
    var tableGrid = [];
    for (var row = 0; row < table.rows.length - 1; row++) {
        var _loop_1 = function() {
            var cellContent = null;
            layers.forEach(function (layer, layerIndex) {
                if (layer.x1 < table.columns[column + 1] && layer.x2 > table.columns[column] && layer.y1 < table.rows[row + 1] && layer.y2 > table.rows[row]) {
                    cellContent = layerIndex;
                }
            });
            if (!tableGrid[row])
                tableGrid[row] = [];
            tableGrid[row].push(cellContent);
        };
        for (var column = 0; column < table.columns.length - 1; column++) {
            _loop_1();
        }
    }
    var result = indent(size.depth, "<table style=\"border-collapse:collapse;table-layout:fixed;width:" + size.width + "px;height:" + size.height + "px;margin:auto;\" border=\"0\" width=\"" + size.width + "\" height=\"" + size.height + "\">");
    if (table.columns.length > 2) {
        result += indent(size.depth + 1, "<colgroup>");
        var cols = "";
        for (var column = 0; column < table.columns.length - 1; column++) {
            var cellWidth = table.columns[column + 1] - table.columns[column];
            if (column === 0 && table.columns[0] > 0)
                cellWidth += table.columns[0];
            cols += "<col style=\"width:" + cellWidth + "px;\"/>";
        }
        result += indent(size.depth + 2, cols);
        result += indent(size.depth + 1, "</colgroup>");
    }
    tableGrid.forEach(function (row, rowIndex) {
        result += indent(size.depth + 1, "<tr>");
        var colspan = 1;
        var empty = false;
        row.forEach(function (cell, colIndex) {
            if (cell === "rowspanned") {
            }
            else if (typeof cell !== "number") {
                var cellWidth = table.columns[colIndex + 1] - table.columns[colIndex + 1 - colspan];
                if (colIndex == tableGrid[0].length - 1 || (typeof tableGrid[rowIndex][colIndex + 1] === "number" || tableGrid[rowIndex][colIndex + 1] === "rowspanned")) {
                    result += indent(size.depth + 2, "<td colspan=\"" + colspan + "\" style=\"width:" + cellWidth + "px;height:" + (table.rows[rowIndex + 1] - table.rows[rowIndex]) + "px\">&shy;</td>");
                    colspan = 1;
                    empty = false;
                }
                else {
                    colspan++;
                    empty = true;
                }
            }
            else if (colIndex < tableGrid[0].length - 1 && tableGrid[rowIndex][colIndex + 1] === cell) {
                colspan++;
            }
            else {
                var rowspan = 1;
                for (var i = rowIndex + 1; i < tableGrid.length; i++) {
                    if (tableGrid[i][colIndex] === cell && tableGrid[i][colIndex + 1] !== cell) {
                        var isFilled = true;
                        for (var z = 0; z < colspan; z++) {
                            if (tableGrid[i][colIndex - z] !== cell)
                                isFilled = false;
                        }
                        if (isFilled) {
                            for (var z = 0; z < colspan; z++) {
                                tableGrid[i][colIndex - z] = "rowspanned";
                            }
                            rowspan++;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
                var cellWidth = table.columns[colIndex + 1] - table.columns[colIndex + 1 - colspan];
                var cellHeight = table.rows[rowIndex + rowspan] - table.rows[rowIndex];
                var cellOffsetX = (colIndex - (colspan - 1) === 0 && table.columns[0] > 0) ? table.columns[0] : 0;
                var cellOffsetY = (layers[cell].y1 - table.rows[rowIndex] > 0) ? layers[cell].y1 - table.rows[rowIndex] : 0;
                var cellStyle = "vertical-align:top;padding:0px;";
                cellStyle += "width:" + cellWidth + "px;";
                cellStyle += "height:" + cellHeight + "px;";
                if (cellOffsetX)
                    cellWidth -= cellOffsetX;
                if (cellOffsetY)
                    cellHeight -= cellOffsetY;
                var childTableSize = {
                    width: cellWidth,
                    height: cellHeight,
                    originalWidth: layers[cell].x2 - layers[cell].x1,
                    originalHeight: layers[cell].y2 - layers[cell].y1,
                    offsetX: table.columns[colIndex - colspan + 1] - layers[cell].x1,
                    offsetY: table.rows[rowIndex] - layers[cell].y1,
                    depth: size.depth + 4
                };
                var cellContent = (layers[cell].children.length === 0) ? getCellContent(layers[cell], size.depth, childTableSize) : createTable(layers[cell].children, childTableSize);
                var isLink = (isURL(layers[cell].url));
                result += indent(size.depth + 2, "<td style=\"" + cellStyle + "\" colspan=\"" + colspan + "\" rowspan=\"" + rowspan + "\">");
                if (isLink)
                    result += indent(size.depth + 3, "<a href=\"" + ((isEmail(layers[cell].url)) ? "mailto:" : "") + layers[cell].url + "\" style=\"text-decoration:none;\" target=\"_blank\">");
                result += indent(size.depth + 3, "<div style=\"" + getCellStyle(layers[cell], childTableSize, { x: cellOffsetX, y: cellOffsetY }) + "\">");
                result += cellContent;
                result += indent(size.depth + 3, "</div>");
                if (isLink)
                    result += indent(size.depth + 3, "</a>");
                result += indent(size.depth + 2, "</td>");
                colspan = 1;
            }
        });
        result += indent(size.depth + 1, "</tr>");
    });
    return "" + result + indent(size.depth, "</table>");
}
function relatativePosition(layout, offset) {
    for (var i = 0; i < layout.length; i++) {
        if (layout[i].children.length > 0) {
            layout[i].children = relatativePosition(layout[i].children, { x: layout[i].x1 + layout[i].border, y: layout[i].y1 + layout[i].border });
        }
        layout[i].x1 -= offset.x;
        layout[i].x2 -= offset.x;
        layout[i].y1 -= offset.y;
        layout[i].y2 -= offset.y;
    }
    return layout;
}
function getCellContent(layer, depth, size) {
    depth += 4;
    if (size.offsetX > 0 || size.offsetY > 0)
        return "";
    if (layer.source && layer.source.length > 0) {
        return indent(depth, "<img src=\"" + layer.source + "\" style=\"display:block;\" width=\"" + (layer.x2 - layer.x1 - layer.border * 2) + "\" height=\"" + (layer.y2 - layer.y1 - layer.border * 2) + "\" alt=\"" + layer.title + "\"/>");
    }
    if (layer.content && layer.content.length > 0) {
        var content_1 = "";
        layer.content.forEach(function (textLayer) {
            var style = "";
            var linkStyle = "text-decoration:none;";
            for (var attribute in textLayer.css) {
                if (!textLayer.css.hasOwnProperty(attribute))
                    continue;
                if (attribute == "text-decoration")
                    linkStyle = "";
                style += attribute + ":" + textLayer.css[attribute] + ";";
            }
            var isLink = isURL(textLayer.text);
            if (isLink) {
                content_1 += indent(depth, "<a href=\"" + ((isEmail(textLayer.text)) ? "mailto:" : "") + textLayer.text + "\" style=\"" + linkStyle + style + "\" target=\"_blank\" style=\"" + style + "\">" + textLayer.text + "</a>");
            }
            else {
                content_1 += indent(depth, "<span style=\"" + style + "\">" + textLayer.text.replace("\n", "<br/>") + "</span>");
            }
        });
        return content_1;
    }
    return "";
}
function getCellStyle(layer, size, offset) {
    var style = "display:block;";
    var width = size.width;
    var height = size.height;
    if (offset.x)
        style += "margin-left:" + offset.x + "px;";
    if (offset.y)
        style += "margin-top:" + offset.y + "px;";
    for (var attribute in layer.css) {
        if (!layer.css.hasOwnProperty(attribute))
            continue;
        if (layer.source && attribute == "background-color")
            continue;
        var value = layer.css[attribute] + ";";
        if (attribute == "border-radius") {
            var values = expandCSS(layer.css[attribute]);
            if (size.offsetX) {
                values[0] = "0";
                values[3] = "0";
            }
            if (size.offsetY) {
                values[0] = "0";
                values[1] = "0";
            }
            if (size.originalWidth > size.width + size.offsetX) {
                values[1] = "0";
                values[2] = "0";
            }
            if (size.originalHeight > size.height + size.offsetY) {
                values[2] = "0";
                values[3] = "0";
            }
            style += attribute + ":" + contractCSS(values) + ";";
        }
        else if (attribute == "border") {
            if (size.width != size.originalWidth || size.height != size.originalHeight) {
                var values = [];
                if (!size.offsetX) {
                    values.push("border-left:" + value);
                    width -= layer.border;
                }
                if (!size.offsetY) {
                    values.push("border-top:" + value);
                    height -= layer.border;
                }
                if (size.originalWidth <= size.width + size.offsetX) {
                    values.push("border-right:" + value);
                    width -= layer.border;
                }
                if (size.originalHeight <= size.height + size.offsetY) {
                    values.push("border-bottom:" + value);
                    height -= layer.border;
                }
                style += values.join(";");
            }
            else {
                width -= layer.border * 2;
                height -= layer.border * 2;
                style += attribute + ":" + value;
            }
        }
        else
            style += attribute + ":" + value;
    }
    if (layer.children.length > 0 && layer.source) {
        var backgroundSize = Math.floor(size.originalWidth / size.width) * 100;
        style += "background-image:url(" + layer.source + ");background-size: " + backgroundSize + "% auto;";
        if (size.offsetX || size.offsetY) {
            style += "background-position:-" + size.offsetX + "px -" + size.offsetY + "px;";
        }
    }
    style += "width:" + width + "px;";
    style += "height:" + height + "px;";
    return style;
}
function appendLayers(layout, currentLayer) {
    var appended = false;
    for (var i = layout.length - 1; i >= 0; i--) {
        if (currentLayer.x1 >= layout[i].x1 && currentLayer.y1 >= layout[i].y1 && currentLayer.x2 <= layout[i].x2 && currentLayer.y2 <= layout[i].y2) {
            appendLayers(layout[i].children, currentLayer);
            appended = true;
            break;
        }
    }
    if (!appended)
        layout.push(currentLayer);
}
function sketchToLayers(layerGroup, offset, command) {
    var layers = [];
    var assets = [];
    layerGroup.forEach(function (layer, type) {
        if (layer.isVisible() && (!offset || !layer.parentGroup().isLayerExportable())) {
            if (layer.class() == MSSymbolInstance && !layer.isLayerExportable()) {
                var children = sketchToLayers(layer.symbolMaster().layers(), { x: layer.frame().x() + ((offset) ? offset.x : 0), y: layer.frame().y() + ((offset) ? offset.y : 0) }, command);
                layers = layers.concat(children.layers);
                assets = assets.concat(children.assets);
            }
            else if (layer.class() == MSLayerGroup && !layer.isLayerExportable()) {
                if (!offset) {
                    var children = sketchToLayers(layer.children(), { x: layer.frame().x(), y: layer.frame().y() }, command);
                    layers = layers.concat(children.layers);
                    assets = assets.concat(children.assets);
                }
            }
            else {
                if ([MSLayerGroup, MSTextLayer, MSShapeGroup, MSBitmapLayer].indexOf(layer.class()) > -1) {
                    var layerCSS = getCSS(layer);
                    var borderWidth = (layerCSS["border"]) ? parseFloat(layerCSS["border"].split(" ")[0]) : 0;
                    layers.unshift({
                        id: unescape(layer.objectID()),
                        title: unescape(layer.name()),
                        url: unescape(command.valueForKey_onLayer("hrefURL", layer)),
                        x1: Math.round(layer.frame().x() + ((offset) ? offset.x : 0)),
                        y1: Math.round(layer.frame().y() + ((offset) ? offset.y : 0)),
                        x2: Math.round(layer.frame().x() + layer.frame().width() + ((offset) ? offset.x : 0)),
                        y2: Math.round(layer.frame().y() + layer.frame().height() + ((offset) ? offset.y : 0)),
                        border: borderWidth,
                        css: layerCSS,
                        content: (layer.class() == MSTextLayer) ? splitText(layer) : null,
                        source: (layer.isLayerExportable()) ? "assets/" + unescape(layer.objectID()) + "@2x.png" : null,
                        children: []
                    });
                }
                if (layer.isLayerExportable()) {
                    assets.push(unescape(layer.objectID()));
                }
            }
        }
    });
    return { layers: layers, assets: assets };
}
function splitText(layer) {
    var textStorage = layer.createTextStorage();
    var attributeRuns = textStorage.attributeRuns();
    var attributeRunsCount = attributeRuns.count();
    var fontWeights = ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"];
    var fontStyles = ["italic", "oblique"];
    var fillColor = (layer.style().fill()) ? layer.style().fill().color() : null;
    var textElements = [];
    for (var i = 0; i < attributeRunsCount; i++) {
        var obj = attributeRuns.objectAtIndex(i);
        var textAttributes = {
            text: "",
            css: {}
        };
        textAttributes.text = unescape(obj.string());
        var font = obj.font();
        var fontFamily = unescape(font.familyName());
        var fontName = unescape(font.displayName());
        var fontVariants = fontName.substr(fontFamily.length + 1).split(" ");
        var fontWeight = fontVariants.filter(function (variant) { return fontWeights.indexOf(variant.toLowerCase()) > -1; });
        if (fontWeight.length == 1)
            textAttributes.css["font-weight"] = (fontWeights.indexOf(fontWeight[0].toLowerCase()) + 1) * 100;
        var fontStyle = fontVariants.filter(function (variant) { return fontStyles.indexOf(variant.toLowerCase()) > -1; });
        if (fontStyle.length == 1)
            textAttributes.css["font-style"] = fontStyle[0].toLowerCase();
        if (obj.attribute_atIndex_effectiveRange_("NSUnderline", 0, null)) {
            textAttributes.css["text-decoration"] = "underline";
        }
        textAttributes.css["font-family"] = "'" + fontFamily + "'";
        textAttributes.css["font-size"] = font.pointSize() + 'px';
        if (!fillColor) {
            var color = obj.foregroundColor().colorUsingColorSpaceName(NSCalibratedRGBColorSpace);
            textAttributes.css["color"] = NSrgbaToHex(color);
            textAttributes.css["opacity"] = color.alphaComponent();
        }
        textElements.push(textAttributes);
    }
    return textElements;
}
function getCSS(layer) {
    var properties = parseCSSAttributes(layer.CSSAttributes().slice(1));
    if (layer.style().fill()) {
        properties["color"] = rgbaToHex(layer.style().fill().color());
    }
    if (layer.class() === MSTextLayer) {
        var textAlignment = [
            'left', 'right', 'center', 'justify'
        ][layer.textAlignment()];
        if (textAlignment)
            properties["text-align"] = textAlignment;
        var textDecoration = null;
        if (layer.styleAttributes().NSStrikethrough)
            textDecoration = 'line-through';
        if (layer.styleAttributes().NSUnderline)
            textDecoration = 'underline';
        if (textDecoration)
            properties["text-decoration"] = textDecoration;
        var textTransform = null;
        if (layer.styleAttributes().MSAttributedStringTextTransformAttribute === 1)
            textTransform = 'uppercase';
        if (layer.styleAttributes().MSAttributedStringTextTransformAttribute === 2)
            textTransform = 'lowercase';
        if (textTransform)
            properties["text-transform"] = textTransform;
    }
    if (isCircle(layer)) {
        properties["border-radius"] = "100%";
    }
    return properties;
}
function parseCSSAttributes(attributes) {
    var result = {};
    attributes.forEach(function (property) {
        var parts = property.split(': ');
        if (parts.length !== 2)
            return;
        var propName = parts[0];
        var propValue = parts[1].replace(';', '');
        switch (propName) {
            case "background":
                propName = "background-color";
                break;
        }
        result[propName] = propValue;
    });
    return result;
}

var pluginIdentifier = "com.sketchapp.slinky-plugin";
function setPreferences(key, value) {
    var settings = NSUserDefaults.standardUserDefaults();
    var preferences = (!settings.dictionaryForKey(pluginIdentifier)) ? NSMutableDictionary.alloc().init() : NSMutableDictionary.dictionaryWithDictionary(settings.dictionaryForKey(pluginIdentifier));
    preferences.setObject_forKey(value, key);
    settings.setObject_forKey(preferences, pluginIdentifier);
    settings.synchronize();
}
function getPreferences(key) {
    var settings = NSUserDefaults.standardUserDefaults();
    if (!settings.dictionaryForKey(pluginIdentifier)) {
        var preferences = NSMutableDictionary.alloc().init();
        preferences.setObject_forKey("0", "sidebar");
        settings.setObject_forKey(preferences, pluginIdentifier);
        settings.synchronize();
    }
    return unescape(settings.dictionaryForKey(pluginIdentifier).objectForKey(key));
}
function dialog(message, title) {
    var app = NSApplication.sharedApplication();
    if (typeof message !== "string")
        message = JSON.stringify(message);
    app.displayDialog_withTitle(message, title || "Slinky");
}
function saveDialog(title, options) {
    var panel = NSSavePanel.savePanel();
    panel.setTitle(title);
    if (options) {
        if (options.promptTitle)
            panel.setPrompt(options.promptTitle);
        if (options.fileName)
            panel.setNameFieldStringValue(options.fileName);
    }
    var result = panel.runModal();
    return (result) ? decodeURIComponent(panel.URL().toString().replace("file://", "")) : null;
}
function saveFile(content, path) {
    var stringData = NSString.stringWithString(content);
    var data = stringData.dataUsingEncoding(NSUTF8StringEncoding);
    return data.writeToFile(path);
}
var sketchtool = NSBundle.mainBundle().pathForResource_ofType_inDirectory("sketchtool", null, "sketchtool/bin");
function exportAssets(context, itemIds, outputFolder) {
    var sketchFile = context.document.fileURL();
    if (!sketchFile || context.document.isDocumentEdited()) {
        NSApplication.sharedApplication().displayDialog_withTitle("To export the assets, save the Sketch file first!", "⚠️ Slinky");
        return;
    }
    else {
        sketchFile = decodeURIComponent(sketchFile.toString().replace("file://", ""));
    }
    context.document.saveDocument(null);
    var command = "/bin/bash";
    var args = [
        "-c",
        "mkdir -p " + outputFolder + " && "
            + sketchtool + ' export ' + 'slices'
            + ' "' + sketchFile + '"'
            + ' --scales=2'
            + ' --formats=png'
            + ' --use-id-for-name=yes'
            + ' --group-contents-only="yes"'
            + ' --save-for-web="no"'
            + ' --overwriting="yes"'
            + ' --compact="yes"'
            + ' --items="' + itemIds.join(",") + '"'
            + ' --output="' + outputFolder.replace("%20", " ") + '"'
    ];
    var task = NSTask.alloc().init();
    var pipe = NSPipe.pipe();
    var errPipe = NSPipe.pipe();
    task.launchPath = command;
    task.arguments = args;
    task.standardOutput = pipe;
    task.standardError = errPipe;
    task.launch();
}
//# sourceMappingURL=index.js.map

function getValue$2(context, identifier, parentID) {
    var panels = getPanel(identifier, parentID);
    if (!panels || !panels.panel)
        return;
    var output = unescape(panels.panel.stringByEvaluatingJavaScriptFromString("getValue()"));
    return output;
}
function setValue(context, identifier, parentID, value) {
    var panels = getPanel(identifier, parentID);
    if (!panels || !panels.panel)
        return;
    panels.panel.stringByEvaluatingJavaScriptFromString("setValue('" + value + "')");
}
function createPanel(context, identifier, parentID, size, remove) {
    var document = NSClassFromString("MSDocument").performSelector(NSSelectorFromString("currentDocument"));
    var panels = getPanel(identifier, parentID);
    if (remove) {
        if (panels.panel) {
            panels.panel.removeFromSuperview();
            var parentFrame = panels.container.frame();
            parentFrame.size.height = parentFrame.size.height - size.height;
            panels.container.setFrame(parentFrame);
            document.inspectorController().selectionDidChangeTo(context.selection);
        }
    }
    else if (!panels.panel) {
        var panel = WebView.alloc().init();
        var childFrame = panel.frame();
        childFrame.size.width = size.width;
        childFrame.size.height = size.height;
        panel.setFrame(childFrame);
        panel.identifier = identifier;
        var url = unescape(context.plugin.urlForResourceNamed("slinky.html"));
        panel.setMainFrameURL_(url);
        panels.container.addSubview(panel);
        var parentFrame = panels.container.frame();
        parentFrame.size.height = parentFrame.size.height + size.height;
        panels.container.setFrame(parentFrame);
        document.inspectorController().selectionDidChangeTo(context.selection);
    }
}
function getPanel(identifier, parentID) {
    var document = NSClassFromString("MSDocument").performSelector(NSSelectorFromString("currentDocument"));
    var contentView = document.inspectorController().view();
    if (!contentView)
        return null;
    var container = viewSearch(contentView, parentID);
    var panel = viewSearch(contentView, identifier);
    return {
        container: container,
        panel: panel
    };
}
function viewSearch(nsview, identifier) {
    var found = null;
    if (nsview.subviews().length > 0) {
        nsview.subviews().forEach(function (subview) {
            if (found)
                return;
            if (subview.identifier() == identifier) {
                found = subview;
            }
            else {
                found = viewSearch(subview, identifier);
            }
        });
    }
    return found;
}
//# sourceMappingURL=sidebar.js.map

function exportHTML(context) {
    if (!context)
        return;
    var artboard = context.document.currentPage().currentArtboard();
    var command = context.command;
    if (!artboard) {
        dialog("Select an artboard first!", "⚠️ Slinky");
        return;
    }
    var exportPath = saveDialog("Export template to", {
        promptTitle: "Export",
        fileName: slugify(artboard.name()) + ".html"
    });
    if (!exportPath)
        return;
    var content = convert(artboard, command);
    var result = saveFile(content.table, exportPath);
    exportAssets(context, content.assets, exportPath.substring(0, exportPath.lastIndexOf("/")) + "/assets/");
    if (result) {
        var workspace = NSWorkspace.sharedWorkspace();
        var updateUrl = NSURL.URLWithString("file://" + exportPath);
        workspace.openURL(updateUrl);
    }
    else {
        dialog("Could not export the template :/ \n\nPlease, report an issue at\nhttps://github.com/finchalyzer/slinky", "⚠️ Slinky");
    }
}
function toggleURL(context) {
    if (!context)
        return;
    var sidebarEnabled = (getPreferences("sidebar") === "1");
    setPreferences("sidebar", (sidebarEnabled) ? "0" : "1");
    createPanel(context, "slinky_url", "view_coordinates", { width: 230, height: 38 }, sidebarEnabled);
}
function onSelectionChanged(context) {
    if (!context)
        return;
    var command = context.command;
    var sidebarEnabled = (getPreferences("sidebar") === "1");
    if (sidebarEnabled) {
        createPanel(context, "slinky_url", "view_coordinates", { width: 230, height: 38 }, false);
    }
    else
        return;
    var oldSelection = context.actionContext.oldSelection;
    var newSelection = context.actionContext.document.selectedLayers().layers();
    var oldURL = getValue$2(context, "slinky_url", "view_coordinates");
    var newUrl = null;
    if (oldURL !== "multiple") {
        oldSelection.forEach(function (layer) {
            command.setValue_forKey_onLayer(oldURL, 'hrefURL', layer);
        });
    }
    newSelection.forEach(function (layer) {
        var value = unescape(command.valueForKey_onLayer('hrefURL', layer));
        if (!newUrl)
            newUrl = value;
        if (newUrl !== value)
            newUrl = "multiple";
    });
    if (!newUrl || newUrl === "null")
        newUrl = "";
    setValue(context, "slinky_url", "view_coordinates", newUrl);
}
var exportHTMLFunc = exportHTML();
var toggleURLFunc = toggleURL();
var selectionChangeFunc = onSelectionChanged();
//# sourceMappingURL=Slinky.js.map
