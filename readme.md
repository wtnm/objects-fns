<!-- toc -->



<!-- tocstop -->

## Overview

`objects-fns` - a bunch of functions to manipulate objects (and arrays)

## Installation

To install the stable version:

```
npm install --save objects-fns
```

## Documentation

### Object functions

#### objSplit(object: anyObject, function: Function, byKey: boolean = false)

Splits `object` into several depending on result provided by `function` which receive every value (or every key
if `byKey`
is `true`) of `object`. Example:

```
let res = objSplit({"_a":1, "a": 2}, (k: string) => k[0] === "_" ? '_keys' : 'rest', true)'
console.log(res) // {"_keys":{"_a":1}. "rest" {"a": 2}}
```

#### objMap(object: any, function: (value: any, track: string[]) => any, track: string[] = [])

Maps every value of `object` with provided `function`, which also receive `track` of value, so that it is possible to
make deep mapping (if needed). Example:

```
let res = objMap({"a":{"b":2}, "c":3}, (value, track)=>{
    if(isObject(value)) return objMap(value, track)
    return -value;
})
console.log(res) // {"a":{"b":-2}, "c":-3}
```

#### objKeys(object: anyObject)

Returns all keys of object. Short form of `Object.keys`

#### objKeysNSymb(object: anyObject)

Returns all keys and symbols of object.

#### getIn(object: any, ...paths: any[])

Returns value from object in `paths`. Example:

```
console.log(getIn({"a":1, "b": {"c": {"d": 5}}}, "b", ["c","d"])); // 5
```

#### hasIn(object: any, ...paths: any[])

Checks if `object` `hasOwnProperty` in `paths`. Example:

```
console.log(hasIn({"a":1, "b": {"c": {"d": undefined}}}, "b", ["c","d"])); // true
console.log(hasIn({"a":1}, "e")); // false
```

#### setIn(object: any, value: any, ...paths: any[])

Sets `value` in `object` by provided `paths`. Example:

```
let res = {"a":1};
setIn(res, 5, "b", ["c","d"]);
console.log(res); // {"a":1, "b": {"c": {"d": 5}}} 
```

#### string2path(path: string)

Returns array of values received by splitting `path` with `/`. Empty values are removed. Example:

```
console.log(string2path("a/b//c")) // ["a", "b", "c"]
```

#### resolvePath(path: any[], base?: any[])

Resolving `path` according to provided `base`. In path can be used `..` and '.' values. Example

```
console.log(resolvePath([",,", "..", "d"], ["a", "b", "c"])) // ["a", "d"]

```

### Array functions

#### push2array(array: any[], ...values: any[])

Pushes `values` into `array`. Any array in `values` is unnested. Example:

```
let arr = [1];
push2array(arr, [2,3], 4);
console.log(arr) // [1, 2, 3, 4];
```

#### moveArrayElems(array: any[], from: number, to: number)

Moves element in `array` from position `from` to position `to`. Example:

```
let arr = [0, 1, 2, 3, 4];
moveArrayElems(arr, 2, 0);
console.log(arr) // [2, 0, 1, 3, 4];

```

#### intoArray(value: any)

if `value` is not array, then returns it as array. Example:

```
console.log(toArray(5)) // [5];
console.log(toArray([])) // [];
```
