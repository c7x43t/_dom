function newPromise(fn){
    let fnThen=undefined;
    let fnCatch=undefined;
    let fnFinally=undefined;
    let reason=undefined;
    let self=this;
    function resolve(value){
        promise["[[PromiseStatus]]"]="resolved";
        promise["[[PromiseValue]]"]=value;
        if(fnThen) fnThen(value);
        initialize();
        if(fnFinally) fnFinally();
    }
    function reject(reason){
        self.reason=reason;
        promise["[[PromiseStatus]]"]="rejected";
        promise["[[PromiseValue]]"]=reason;
        if(fnCatch){
            fnCatch(reason);    
        }else{
            throw reason;
        }
        initialize();
        if(fnFinally) fnFinally();    
    }
    function initialize(){
        promise["[[PromiseStatus]]"]="pending";
        promise["[[PromiseValue]]"]=undefined;
    }
    let promise={};
    initialize();
    promise.then=function(fn){
        if(promise["[[PromiseStatus]]"]==="resolved"){
            fn(promise["[[PromiseStatus]]"]);
        }
        fnThen=fn;
        return promise;
    }
    promise.finally=function(fn){
        fnFinally=fn;
        // what to return?
    }
    promise.catch=function(fn){
        if(promise["[[PromiseStatus]]"]==="rejected"){
            fn(reason);
            throw reason;
        }
        fnCatch=fn;
        return promise;
    }
    fn(resolve,reject);
    return promise;
}
