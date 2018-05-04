function newPromise(fn){
    const PROMISE_STATUS="[[PromiseStatus]]";
    const PROMISE_VALUE="[[PromiseValue]]";
	const PENDING="pending";
	const RESOLVED="resolved";
	const REJECTED="rejected";
    let fnThen=undefined;
    let fnCatch=undefined;
    let fnFinally=undefined;
    let reason=undefined;
    let self=this;
    function resolve(value){
        promise[PROMISE_STATUS]=RESOLVED;
        promise[PROMISE_VALUE]=value;
        if(fnThen){
            fnThen(value);
            initialize();
        }
        if(fnFinally) fnFinally(); //?
    }
    function reject(reason){
        self.reason=reason;
        promise[PROMISE_STATUS]=REJECTED;
        promise[PROMISE_VALUE]=reason;
        if(fnCatch){
            fnCatch(reason);
            initialize();
        }else{
            throw reason;
        }
        if(fnFinally) fnFinally(); //?
    }
    function initialize(){
        promise[PROMISE_STATUS]=PENDING;
        promise[PROMISE_VALUE]=undefined;
		fnThen=undefined;
		fnCatch=undefined;
		fnFinally=undefined;
		reason=undefined;
    }
    let promise={};
    initialize();
    promise.then=function(fn){
        if(promise[PROMISE_STATUS]===RESOLVED){
            fn(promise[PROMISE_STATUS]);
			initialize();
        }
        fnThen=fn;
        return promise;
    }
    promise.finally=function(fn){
        if(promise[PROMISE_STATUS]!==PENDING){
            fn();
        }
        fnFinally=fn;
        // what to return?
    }
    promise.catch=function(fn){
        if(promise[PROMISE_STATUS]===REJECTED){
            fn(reason);
            throw reason;
        }
        fnCatch=fn;
        return promise;
    }
    fn(resolve,reject);
    return promise;
}
