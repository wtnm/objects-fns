export interface anyObject {
  [key: string]: any;

  [key: number]: any;
}

export type PathElement = string | number | symbol;

const isArray = Array.isArray;

const isUndefined = (value: any): value is undefined => typeof value === 'undefined';

function isMergeable(val: any) {
  const nonNullObject = val && typeof val === 'object';
  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
}



const objKeys = Object.keys;

const objKeysNSymb = (obj: any): any[] => (objKeys(obj) as any[]).concat(Object.getOwnPropertySymbols(obj));

const objMap = (object: any, fn: (item: any, track: string[]) => any, track: string[] = []) =>
  objKeys(object).reduce((result, key) => ((result[key] = fn(object[key], track.concat(key))) || true) && result, isArray(object) ? [] : {});


function objSplit(obj: anyObject, fn: Function, byKey: boolean = false) {
  let res: any[] = [];
  objKeys(obj).forEach((key) => setIn(res, obj[key], fn(byKey ? key : obj[key]), key));
  return res;
}

function splitBy$(obj: anyObject) {
  return objSplit(obj, (k: string) => k[0] === '$' ? 0 : 1, true)
}


//////////////////////////////
//  object get/set functions
/////////////////////////////

function getIn(state: any, ...paths: any[]): any {
  let res = state;
  for (let i = 0; i < paths.length; i++) {
    let track = paths[i];
    if (typeof track === 'function') track = track(res);
    if (!isArray(track)) track = [track];
    for (let j = 0; j < track.length; j++) {
      if (!isMergeable(res)) return undefined;
      if (isUndefined(track[j])) continue;
      res = res[track[j]];
    }
  }
  return res;
}


function hasIn(state: any, ...paths: any[]) {
  if (paths.length > 0) {
    for (let i = 0; i < paths.length; i++) {
      let path = isArray(paths[i]) ? paths[i] : [paths[i]];
      for (let j = 0; j < path.length; j++) {
        if (isUndefined(path[j])) continue;
        try {
          if (!state.hasOwnProperty(path[j])) return false;
        } catch (e) {return false;}
        state = state[path[j]]
      }
    }
  }
  return true
}

function setIn(state: any, value: any, ...paths: any[]) {
  let result = state;
  let key;
  if (paths.length > 0) {
    for (let i = 0; i < paths.length; i++) {
      let path = isArray(paths[i]) ? paths[i] : [paths[i]];
      for (let j = 0; j < path.length; j++) {
        if (isUndefined(path[j])) continue;
        if (!isUndefined(key)) {
          if (!isMergeable(result[key])) result[key] = {};
          result = result[key];
        }
        key = path[j];

        // prev = result;
        // result = result[key];
      }
    }
  }
  if (!isUndefined(key)) result[key] = value;
  else return value;
  return state;
}

// function delIn(state: any, path: any[]) {
//   // if (path[0] == '#') path = path.slice(1);
//   if (!path.length) return state;
//   const keys = typeof path[0] == 'string' ? path[0].split(',') : [path[0]];
//   const newPath = path.slice(1);
//   if (newPath.length) {
//     keys.forEach((key: any) => {
//       let newObj;
//       if (isMergeable(state[key])) newObj = delIn(state[key], newPath);
//       if (newObj && (newObj !== state[key])) state = merge(state, {[key]: newObj}, {replace: {[key]: true}})
//     })
//   } else {
//     for (let i = 0; i < keys.length; i++) {
//       if (state.hasOwnProperty(keys[i])) {
//         state = Object.assign({}, state);
//         break
//       }
//     }
//     for (let i = 0; i < keys.length; i++) delete state[keys[i]]
//   }
//   return state
// }


function string2path(path: string, {str2sym, replace}: any = {}): PathElement[] {
  // path = path.replace(symConv(SymData), '/' + symConv(SymData) + '/');
  if (replace) path = replace(path);
  path = path.replace(/\/+/g, '/');
  const result: any[] = [];
  path.split('/').forEach(key => key && (key = (str2sym ? str2sym(key.trim()) : key.trim())) && result.push(key));
  return result
}

function resolvePath(path: PathElement[], base?: PathElement[]) {
  const result: any[] = (base && (path[0] === '.' || path[0] == '..')) ? base.slice() : [];
  for (let i = 0; i < path.length; i++) {
    let val = path[i];
    if (val === '..') result.pop();
    else if (val !== '' && val !== '.') result.push(val);
  }
  return result;
}


export {objSplit, splitBy$, objMap, objKeys, objKeysNSymb, getIn, hasIn, setIn, string2path, resolvePath};


/// Array

function push2array(array: any[], ...vals: any[]): any {
  for (let i = 0; i < vals.length; i++) {
    if (isArray(vals[i])) array.push(...vals[i]);
    else array.push(vals[i])
  }
  return array
}


function moveArrayElems(arr: any[], from: number, to: number): Array<any> {
  let length = arr.length;
  if (length) {
    from = (from % length + length) % length;
    to = (to % length + length) % length;
  }
  let elem = arr[from];
  for (let i = from; i < to; i++) arr[i] = arr [i + 1];
  for (let i = from; i > to; i--) arr[i] = arr [i - 1];
  arr[to] = elem;
  return arr
}


const toArray = (value: any) => isArray(value) ? value : [value];
const deArray = (value: any, keepArray?: boolean) => !keepArray && isArray(value) && value.length == 1 ? value[0] : value;


export {push2array, moveArrayElems, toArray, deArray} // array-fns
