// for Promise polyfill see https://cdn.jsdelivr.net/npm/es6-promise/dist/es6-promise.js 
// https://developers.google.com/web/fundamentals/primers/promises
// https://github.com/Reactive-Extensions/RxJS
// https://highlandjs.org/
function newStream(){
    var store={};
    var finite={}; // not yet implemented ~ once and more {fn.name:n}
    var error={}; // currently no direct access to error channel
    var buffers={};
    var transforms=[];
    var retryCount=0;
    var retryMax=0;
    var filtered=false;
    var transformers={
        map: function(data,fn){
            return fn(data);
        },
        filter: function(data,fn){
            if(!fn(data)){
                filtered=true;
            }
        }
    };
    function stream(data){
        // transform data
        for(var transform of transforms){
            data=transformers[transform.type](data,transform.fn);
        }
        // push data
        var fns=Object.keys(store);
        // iterate functions in store
        if(!filtered){
            for(var i=0;i<fns.length;i++){
                try{
                    // execute functions in store
                    store[fns[i]](data);
                }catch(err){ // propably wrong implementation
                    // retry if configured
                    if(retryCount<retryMax){
                        i--;
                        retryCount++;
                        continue;
                    }
                    // push error to registered error channels
                    var errs=Object.keys(error);
                    for(var j=0;j<errs.length;j++){
                        error[errs[j]](err);
                    }
                }
                retryCount=0;
            }
        }
        filtered=false;
    }
    stream.add=function(fn){
        store[fn.name]=fn;
        return stream;
    };
    stream.remove=function(fn){ // returns true/false
        delete store[fn.name];
        return stream;
    };
    stream.addError=function(fn){
        error[fn.name]=fn;
        return stream;
    };
    stream.removeError=function(fn){ // returns true/false
        delete error[fn.name];
        return stream;
    };
    //mimic API
    stream.subscribe=stream.add;
    stream.retry=function(n){
        retryMax=n;
    };
    stream.fromEvent = function(obj,name){
        obj.addEventListener(name,stream);
    };
    stream.map=function(fn){
        transforms.push({type:"map",fn:fn});
    };
    stream.filter=function(fn){
        transforms.push({type:"filter",fn:fn});
    };
    stream.observe=function(observable){
        observable.subscribe(stream);
    };
    function wrapCallback(){ //https://github.com/adriaan-pelzer/highland-wrapCallback
    }
    return stream;
}
//Test
function printHit(data){
    console.log(data);
}
function printDoubleHit(data){
    console.log(data*2);
}

let stream=newStream()
.add(printHit)
.add(printDoubleHit);


stream(1);
stream(2);


// Iterator + imagine backpressure:
/*
range(0, 1000, 1)
.map(function (n) {
    return n * 2;
})
.filter(function (n) {
    return n % 3 !== 0;
})
.reduce(function (a, b) {
    return a + b;
})
*/
