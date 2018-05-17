// memoizer which handles objects, arrays and multiple arguments at a ~25% performance hit
function memoize(fn) {
    let map = {};
     return function(e) {
            var str = fastSerialize(arguments.length > 1 ? argumentsToArray(arguments) : e)
            if (Reflect.get(map, str)) { // from cache
                return map[str];
            } else { // from function
                let val = fn(...arguments);
                map[str] = val;
                return val;
            }
        }
   


}

function argumentsToArray(args) {
    var result = [];
    for (var i = 0; i < args.length; i++) {
        result.push(args[i]);
    }
    return result;
}

function fastSerialize(o) {
    if (typeof o !== "object") return o; // fast obj test
    let n;
    if (o instanceof Array) { // fast array test
        n = "[";
        const l = o.length - 1;
        for (let i = 0; i <= l; i++) {
            n += fastSerialize(o[i]);
            if (i < l) n += ",";
        }
        n += "]";
        return n;
    }
    n = JSON.stringify(o);
    return n;
}
