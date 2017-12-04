function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

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
var splice = arrayProto.splice;
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
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);
  this.size = data.size;
  return result;
}

function stackGet(key) {
  return this.__data__.get(key);
}

function stackHas(key) {
  return this.__data__.has(key);
}

var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function('return this')();

var Symbol = root.Symbol;

var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
var nativeObjectToString = objectProto$1.toString;
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;
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

var objectProto$2 = Object.prototype;
var nativeObjectToString$1 = objectProto$2.toString;
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var asyncTag = '[object AsyncFunction]';
var funcTag$1 = '[object Function]';
var genTag$1 = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}

var coreJsData = root['__core-js_shared__'];

var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
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
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype;
var objectProto = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

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

function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var HASH_UNDEFINED = '__lodash_hash_undefined__';
var objectProto$3 = Object.prototype;
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
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
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

var LARGE_ARRAY_SIZE = 200;
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
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

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
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
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

function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var argsTag$1 = '[object Arguments]';
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$1;
}

var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$6.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArray = Array.isArray;

function stubFalse() {
  return false;
}

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? root.Buffer : undefined;
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
var isBuffer = nativeIsBuffer || stubFalse;

var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

var MAX_SAFE_INTEGER$1 = 9007199254740991;
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
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var freeProcess = moduleExports$1 && freeGlobal.process;
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
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
           key == 'length' ||
           (isBuff && (key == 'offset' || key == 'parent')) ||
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var objectProto$9 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;
  return value === proto;
}

function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var nativeKeys = overArg(Object.keys, Object);

var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
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
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;
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
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
var Buffer$1 = moduleExports$2 ? root.Buffer : undefined;
var allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}

function copyArray(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

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

function stubArray() {
  return [];
}

var objectProto$11 = Object.prototype;
var propertyIsEnumerable$1 = objectProto$11.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
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
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set);
var weakMapCtorString = toSource(WeakMap);
var getTag = baseGetTag;
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

var objectProto$12 = Object.prototype;
var hasOwnProperty$9 = objectProto$12.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);
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

function addMapEntry(map, pair) {
  map.set(pair[0], pair[1]);
  return map;
}

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

function mapToArray(map) {
  var index = -1,
      result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var CLONE_DEEP_FLAG$1 = 1;
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG$1) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

function addSetEntry(set, value) {
  set.add(value);
  return set;
}

function setToArray(set) {
  var index = -1,
      result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var CLONE_DEEP_FLAG$2 = 1;
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG$2) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

var symbolProto = Symbol ? Symbol.prototype : undefined;
var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
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
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var CLONE_SYMBOLS_FLAG = 4;
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
function formatLink(string) {
    return (isEmail(string)) ? "mailto:" + string : (string.indexOf("http") === 0) ? string : "http://" + string;
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

function convert(artboard, command, sketchVersion) {
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
    var bodyBackground = (sketchVersion < 44) ? artboard.backgroundColorGeneric() : artboard.backgroundColor();
    return {
        table: template(rgbaToHex(bodyBackground), table),
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
        row.forEach(function (cell, colIndex) {
            if (cell === "rowspanned") {
            }
            else if (typeof cell !== "number") {
                var cellWidth = table.columns[colIndex + 1] - table.columns[colIndex + 1 - colspan];
                if (colIndex == tableGrid[0].length - 1 || (typeof tableGrid[rowIndex][colIndex + 1] === "number" || tableGrid[rowIndex][colIndex + 1] === "rowspanned")) {
                    result += indent(size.depth + 2, "<td colspan=\"" + colspan + "\" style=\"width:" + cellWidth + "px;height:" + (table.rows[rowIndex + 1] - table.rows[rowIndex]) + "px\">&shy;</td>");
                    colspan = 1;
                }
                else {
                    colspan++;
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
                result += indent(size.depth + 2, "<td style=\"" + cellStyle + "\" colspan=\"" + colspan + "\" rowspan=\"" + rowspan + "\">");
                if (layers[cell].url)
                    result += indent(size.depth + 3, "<a href=\"" + formatLink(layers[cell].url) + "\" style=\"text-decoration:none;\">");
                result += indent(size.depth + 3, "<div style=\"" + getCellStyle(layers[cell], childTableSize, { x: cellOffsetX, y: cellOffsetY }) + "\">");
                result += cellContent;
                result += indent(size.depth + 3, "</div>");
                if (layers[cell].url)
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
            if (isLink && !layer.url) {
                content_1 += indent(depth, "<a href=\"" + formatLink(textLayer.text) + "\" style=\"" + linkStyle + style + "\" style=\"" + style + "\">" + textLayer.text + "</a>");
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
                    var url = unescape(command.valueForKey_onLayer("hrefURL", layer));
                    layers.unshift({
                        id: unescape(layer.objectID()),
                        title: unescape(layer.name()),
                        url: (url.length > 0 && url !== "null") ? url : null,
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
    var fontWeights = ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"];
    var fontStyles = ["italic", "oblique"];
    var hasFill = (layer.style().fills().firstObject()) ? true : null;
    var textElements = [];
    var attributes = layer.attributedStringValue().treeAsDictionary().attributes;
    attributes.forEach(function (attribute) {
        var font = attribute.NSFont;
        var fontFamily = unescape(font.family);
        var fontName = unescape(font.name);
        var fontVariants = fontName.substr(fontFamily.length + 1).split(" ");
        var fontWeight = fontVariants.filter(function (variant) { return fontWeights.indexOf(variant.toLowerCase()) > -1; });
        var fontStyle = fontVariants.filter(function (variant) { return fontStyles.indexOf(variant.toLowerCase()) > -1; });
        var fontColor = layer.attributedStringValue().attribute_atIndex_effectiveRange_("NSColor", attribute.location, null);
        var css = {
            "font-weight": (fontWeight.length == 1) ? (fontWeights.indexOf(fontWeight[0].toLowerCase()) + 1) * 100 + "" : null,
            "font-style": (fontStyle.length == 1) ? fontStyle[0].toLowerCase() : null,
            "text-decoration": (layer.attributedStringValue().attribute_atIndex_effectiveRange_("NSUnderline", attribute.location, null)) ? "underline" : null,
            "font-family": "'" + fontFamily + "'",
            "font-size": font.attributes.NSFontSizeAttribute + 'px',
            "color": (!hasFill && fontColor) ? NSrgbaToHex(fontColor) : null,
        };
        for (var propName in css) {
            if (css[propName] === null || css[propName] === undefined) {
                delete css[propName];
            }
        }
        textElements.push({
            text: unescape(attribute.text),
            css: css
        });
    });
    return textElements;
}
function getCSS(layer) {
    var properties = parseCSSAttributes(layer.CSSAttributes().slice(1));
    if (layer.style().fills().firstObject()) {
        properties["color"] = rgbaToHex(layer.style().fills().firstObject().color());
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
        return true;
    }
    else {
        sketchFile = decodeURIComponent(sketchFile.toString().replace("file://", ""));
    }
    context.document.saveDocument(null);
    var args = [
        "-c",
        "-l",
        sketchtool + ' export ' + 'slices'
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
    return runCommand("/bin/mkdir", ["-p", outputFolder])
        && runCommand("/bin/bash", args);
}
function runCommand(command, args) {
    log("Run Command: " + command + " " + args.join(" ") + "");
    var task = NSTask.alloc().init();
    var pipe = NSPipe.pipe();
    var errPipe = NSPipe.pipe();
    task.setLaunchPath_(command);
    task.arguments = args;
    task.standardOutput = pipe;
    task.standardError = errPipe;
    try {
        task.launch();
        task.waitUntilExit();
        return (task.terminationStatus() == 0);
    }
    catch (e) {
        log("❌ Cannot run command: " + e);
        return false;
    }
}
//# sourceMappingURL=index.js.map

var sidebarID = "slinky_url";
var sidebarParent = "view_coordinates";
var sideberSize = {
    width: 230,
    height: 38
};
function getValue$2(context) {
    var panels = getPanel(sidebarID, sidebarParent);
    if (!panels || !panels.panel)
        return;
    var output = unescape(panels.panel.stringByEvaluatingJavaScriptFromString("getValue()"));
    return output;
}
function updateSidebar(context, remove) {
    var document = NSClassFromString("MSDocument").performSelector(NSSelectorFromString("currentDocument"));
    var panels = getPanel(sidebarID, sidebarParent);
    if (remove) {
        if (panels.panel) {
            panels.panel.removeFromSuperview();
            var parentFrame = panels.container.frame();
            parentFrame.size.height = parentFrame.size.height - sideberSize.height;
            panels.container.setFrame(parentFrame);
            document.inspectorController().selectionDidChangeTo(context.selection);
        }
        return;
    }
    var url = null;
    var selection = document.selectedLayers().layers();
    selection.forEach(function (layer) {
        var value = unescape(context.command.valueForKey_onLayer('hrefURL', layer));
        if (!url)
            url = value;
        if (url !== value)
            url = "multiple";
    });
    if (!url || url === "null")
        url = "";
    if (panels.panel) {
        panels.panel.stringByEvaluatingJavaScriptFromString("setValue('" + url + "')");
    }
    else {
        var panel = WebView.alloc().init();
        var childFrame = panel.frame();
        childFrame.size.width = sideberSize.width;
        childFrame.size.height = sideberSize.height;
        panel.setFrame(childFrame);
        panel.identifier = sidebarID;
        var path = unescape(context.plugin.urlForResourceNamed("slinky.html")) + ("#" + url);
        panel.setMainFrameURL_(path);
        panels.container.addSubview(panel);
        var parentFrame = panels.container.frame();
        parentFrame.size.height = parentFrame.size.height + sideberSize.height;
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
    var sketchVersion = parseFloat(context.api().version);
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
    var content = convert(artboard, command, sketchVersion);
    var result = saveFile(content.table, exportPath);
    var isAssetsExported = exportAssets(context, content.assets, exportPath.substring(0, exportPath.lastIndexOf("/")) + "/assets/");
    if (result && isAssetsExported) {
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
    updateSidebar(context, sidebarEnabled);
}
function onSelectionChanged(context) {
    if (!context)
        return;
    var sidebarEnabled = (getPreferences("sidebar") === "1");
    if (!sidebarEnabled)
        return;
    var selection = context.actionContext.oldSelection;
    var url = getValue$2(context);
    if (url !== "multiple") {
        selection.forEach(function (layer) {
            var value = unescape(context.command.valueForKey_onLayer('hrefURL', layer));
            if (!url || (url.length === 0 && value.length === 0))
                return;
            context.command.setValue_forKey_onLayer(url, 'hrefURL', layer);
        });
    }
    updateSidebar(context);
}
var exportHTMLFunc = exportHTML();
var toggleURLFunc = toggleURL();
var selectionChangeFunc = onSelectionChanged();
//# sourceMappingURL=Slinky.js.map
