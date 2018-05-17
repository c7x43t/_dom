function memoize(fn) {
    let map = {};
    return function(e) {
        if (Reflect.get(map, e)) { // from cache
            return map[e];
        } else { // from function
            let val = fn(e);
            map[e] = val;
            return val;
        }
    }
}
