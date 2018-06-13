// deep copy:
// String, Number, undefined, null, Set, Map, typed Array, Object, Boolean, RegExp, Date, ArrayBuffer, Node
// Functions, Properties of types: (Primitive, Symbol)
// shallow copy (by reference):
// WeakMap, WeakSet, Symbol
// increased compatibility: IE, Node
// compatible with E API (_dom.js)
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    a != Array.prototype && a != Object.prototype && (a[b] = c.value)
};
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.Symbol = function() {
    var a = 0;
    return function(b) {
        return $jscomp.SYMBOL_PREFIX + (b || "") + a++
    }
}();
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.arrayIterator(this)
        }
    });
    $jscomp.initSymbolIterator = function() {}
};
$jscomp.arrayIterator = function(a) {
    var b = 0;
    return $jscomp.iteratorPrototype(function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    })
};
$jscomp.iteratorPrototype = function(a) {
    $jscomp.initSymbolIterator();
    a = {
        next: a
    };
    a[$jscomp.global.Symbol.iterator] = function() {
        return this
    };
    return a
};
function iteratorToArray(iterator){
	var keys=[];
    var next={};
    while(true){
        next=iterator.next();
        if(!next.done){
            keys.push(next.value);
        }else{
            break;
        }
    }
    return keys;
}
function deepCopy(o) {
    if ((typeof o !== "object" || o === null) && !(o instanceof Function)) return o; // fast obj/null test
    var n, keys;
    var  c = o.constructor;
	$jscomp.initSymbol();
    $jscomp.initSymbolIterator();
	if (o[Symbol.iterator] instanceof Function) { // fast array test
        // Map and Set have no length property so they will be correctly var ructed
        var  l = o.length;
        n = (new c(l));
        switch (c.name) {
            case "Set":
                //for (var e of o) n.add(deepCopy(e));
				fastMap(iteratorToArray(o.keys()),function(e){
					n.add(deepCopy(e));
				});
                break;
            case "Map":
				fastMap(iteratorToArray(o.keys()),function(key){
					n.set(key, deepCopy(o.get(key)));
				});
                //for (var [key, value] of o) n.set(key, deepCopy(value));
                break;
        }
		fastMap(o,function(e,i){
			n[i] = deepCopy(e);
		});
    } else {
        if (c.name !== "Object") {
            switch (c.name) {
                case "Function":
                    var str = o.toString();
                    if(/ \[native code\] /.exec(str) === null){
                        var args=/^.*?\((.*?)\)/.exec(str)[1];//.split(/,/);
                        var func=/^.*?{(.*)}/.exec(str)[1];
                        n=new c(args,func);
                    }else{
                        n=o;
                    }
                    break;
                case "RegExp":
                    n = new c(o.valueOf());
                    break;
                case "Date":
                    n = new c(o);
                    break;
                case "ArrayBuffer":
					n = new c((new $jscomp.global["Int8Array"](o)).length);
                    break;
                default:
					n = o instanceof Node? o.cloneNode(true) : o;
            }
            keys = Object.keys(o);
        } else {
            n = {};
            keys = Object.getOwnPropertyNames(o);
        }
		fastMap(keys,function(i){
			deepCopy(o[i]);
		});
    }
	if(Object.getOwnPropertySymbols){
		fastMap(Object.getOwnPropertySymbols(o),function(i){
			n[i] = deepCopy(o[i]);
		});
	}
    
    return n;
}
