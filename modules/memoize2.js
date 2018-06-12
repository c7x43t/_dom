// input: function, array of arguments, (optionally: true, if async function) 
var memoize = (function() {
    let store = {};

    function objectChainGet(o, arr, i = 0, l = undefined) {
        arr = forceArray(arr);
        let pointer = o;
        for (l = l === undefined ? arr.length : l; i < l-1; i++) {
            if (typeof pointer[arr[i]] === 'undefined') {
				
                objectChainInit(pointer, arr, i);
            }
            pointer = pointer[arr[i]];
        }
		i=arr.length-1;
		var val=pointer[arr[i]];
		return {val:val,pointer:pointer};
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
        for (i>0?i--:i; i < arr.length-1; i++) {
            if (pointer[arr[i]] === undefined) pointer[arr[i]] = {};
            pointer = pointer[arr[i]];
        }
    }
    return function(func, args,nonsync=false) {
        args = forceArray(args);
        var value = objectChainGet(store, [func.name, ...args]);
		if(nonsync){
			return new Promise(function(res,rej){
				if (value.val === undefined) {
				try{
					val = func(...args);
				}catch(err){
					rej(err);
				}
				value.pointer[args[args.length-1]]=val;
				res(val);
			}
			res(value.val);
			})
		}
        if (value.val === undefined) {
            val = func(...args);
			value.pointer[args[args.length-1]]=val;
			return val;
        }
        return value.val;
    }
})();
