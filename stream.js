// for Promise polyfill see https://cdn.jsdelivr.net/npm/es6-promise/dist/es6-promise.js 
// https://developers.google.com/web/fundamentals/primers/promises
// https://github.com/Reactive-Extensions/RxJS
function newStream(){
    let store={};
    let finite={}; // not yet implemented ~ once and more {fn.name:n}
    let error={}; // currently no direct access to error channel
    function stream(data){
        let fns=Object.keys(store);
        for(var i=0;i<fns.length;i++){
            try{
                store[fns[i]](data);
            }catch(err){ // propably wrong implementation
                let errs=Object.keys(error);
                for(var j=0;j<errs.length;j++){
                    error[errs[j]](err);
                }
            }
        }
    }
    stream.add=function(fn){
        store[fn.name]=fn;
        return stream;
    }
    stream.remove=function(fn){ // returns true/false
        delete store[fn.name];
        return stream;
    }
    stream.addError=function(fn){
        error[fn.name]=fn;
        return stream;
    }
    stream.removeError=function(fn){ // returns true/false
        delete error[fn.name];
        return stream;
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
