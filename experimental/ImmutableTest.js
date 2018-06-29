var immutableHandler={
	get: function(obj,key){
		return obj.hasOwnProperty(key)?obj[key]:obj.hasOwnProperty("__Parent__")?obj.__Parent__[key]:undefined;
	},
	has: function(obj,key){
		return obj.__Keys__.has(key)
	}
}

function objectClone(obj){
    const ret = {};
    for (let i in obj) {
        ret[i] = obj[i];
    }
    return ret;
}
function Immutable(obj){
	var objKeys=Object.keys(obj);
	
	//var clone=Object.assign({},obj);
	var clone=objectClone(obj);
	
	function collector(){};
	for(var key of objKeys){
		collector.prototype[key]=NOOP;
	}
	Object.setPrototypeOf(clone,collector.prototype);
	Object.defineProperty(clone,"__Collector__",{value:collector});
	
	var keys=new Set(objKeys);
	Object.defineProperty(clone,"__Keys__",{value:keys});
	
	var proxy = new Proxy(clone, immutableHandler);
	proxy[Symbol.iterator]=iterator;
	// Object.freeze(makeIterable(proxy));
	Object.freeze(proxy);
	return proxy;
}

function NOOP(){}
function objectSubclass(obj){
	var subObj={};
	function collector(){};
	for(var key of obj.__Keys__){
		collector.prototype[key]=NOOP;
	}
	Object.setPrototypeOf(subObj,collector.prototype);
	//collector.prototype=Object.create(Object.prototype);	
	return subObj;
}
function set(obj,key,value){
	var newObj={};
	obj.__Collector__.prototype[key]=NOOP;
	function collector(){};
	collector.prototype[key]=NOOP;
	Object.setPrototypeOf(collector,obj.__Collector__.prototype);
	Object.setPrototypeOf(newObj,collector);
	var keys = new Set(obj.__Keys__);
	keys.add(key+"");
	Object.defineProperty(newObj,"__Keys__",{value:keys});
	Object.defineProperty(newObj,"__Parent__",{value:obj});
	newObj[key]=value;
	var proxy=new Proxy(newObj, immutableHandler);
	proxy[Symbol.iterator]=iterator;
	//Object.freeze(makeIterable(proxy));
	Object.freeze(proxy);
	return proxy;
}
function* iterator(){
	for(var key of this.__Keys__){ 
		yield this[key];
	}
}
function makeIterable(imm){
	imm[Symbol.iterator]=function*(){
		for(var key of this.__Keys__){ 
			yield this[key];
		}
	}
	return imm;
}
var target={a:3};
var p = Immutable(target);

// Benchmark
var time=performance.now()
var sel=".center";
var handler={},obj={a:1,b:2},clone;
for(var i=0;i<5e5;i++){
	clone=Immutable(obj)
}
performance.now()-time
