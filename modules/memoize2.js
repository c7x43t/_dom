var memoize = (function() {
    let store = {};

    function objectChainGet(o, arr, i = 0, l = undefined) {
        arr = forceArray(arr);
        let pointer = o;
        for (l = l === undefined ? arr.length : l; i < l; i++) {
            if (typeof pointer[arr[i]] === 'undefined' && i < l - 1) {
                objectChainInit(pointer, arr, i);
            }
            pointer = pointer[arr[i]];
        }
        return pointer;
    }

    function objectChainSet(o, arr, value) { // optimize: set is calling get a second time
        arr = forceArray(arr);
        return objectChainGet(o, arr, 0, arr.length - 1)[arr[arr.length - 1]] = value;
    }

    function forceArray(arr) {
        return arr instanceof Array ? arr : [arr];
    }

    function objectChainInit(o, arr, i = 0) {
        let pointer = o;
        arr = forceArray(arr);
        for (; i < arr.length - 1; i++) {
            if (pointer[arr[i]] === undefined) pointer[arr[i]] = {};
            pointer = pointer[arr[i]];
        }
    }
    return function(func, args) {
        args = forceArray(args);
        var value = objectChainGet(store, [func.name, ...args]);
        if (value === undefined) {
            value = func(...args);
            objectChainSet(store, [func.name, ...args], value);
        }
        return value;
    }
})();
