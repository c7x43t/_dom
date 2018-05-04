function newPromise(fn){
    let fnThen=undefined;
    let fnCatch=undefined;
    let reason=undefined;
    let self=this;
    function resolve(value){
        promise["[[PromiseStatus]]"]="resolved";
        promise["[[PromiseValue]]"]=value;
        if(fnThen) fnThen(value);
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
    }
    let promise={};
    promise["[[PromiseStatus]]"]="pending";
    promise["[[PromiseValue]]"]=undefined;
    promise.then=function(fn){
        if(promise["[[PromiseStatus]]"]==="resolved"){
            fn(promise["[[PromiseStatus]]"]);
        }
        fnThen=fn;
        return promise;
    }
    promise.finally=function(fn){}
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
