const undef = void 0; // substitute for undefined
function _Promise(fn) {
    const PROMISE_STATUS = "[[PromiseStatus]]";
    const PROMISE_VALUE = "[[PromiseValue]]";
    const PENDING = "pending";
    const RESOLVED = "resolved";
    const REJECTED = "rejected";
    let fnThen = undef;
    let fnCatch = undef;
    let fnFinally = undef;
    let reason = undef;
    let self = this;
    function resolve(value) {
        promise[PROMISE_STATUS] = RESOLVED;
        promise[PROMISE_VALUE] = value;
        if (fnThen) {
            fnThen(value);
            initialize();
        }
        if (fnFinally) fnFinally(); //?
    }

    function reject(reason) {
        self.reason = reason;
        promise[PROMISE_STATUS] = REJECTED;
        promise[PROMISE_VALUE] = reason;
        if (fnCatch) {
            fnCatch(reason);
            initialize();
        } else {
            throw reason;
        }
        if (fnFinally) fnFinally(); //?
    }

    function initialize() {
        promise[PROMISE_STATUS] = PENDING;
        promise[PROMISE_VALUE] = undef;
        fnThen = undef;
        fnCatch = undef;
        fnFinally = undef;
        reason = undef;
    }
    let promise = {};
    initialize();
    function _then(fn) {
        if (promise[PROMISE_STATUS] === RESOLVED) {
            fn(promise[PROMISE_VALUE]);
            initialize();
        }
        fnThen = fn;
        return promise;
    }
    function _finally(fn) {
        if (promise[PROMISE_STATUS] !== PENDING) {
            fn();
        }
        fnFinally = fn;
        // what to return?
    }
    function _catch(fn) {
        if (promise[PROMISE_STATUS] === REJECTED) {
            fn(reason);
            throw reason;
        }
        fnCatch = fn;
        return promise;
    }
    Object.defineProperty(promise,"then",{value:_then});
    Object.defineProperty(promise,"finally",{value:_finally});
    Object.defineProperty(promise,"catch",{value:_catch});
    Object.defineProperty(promise,"constructor",{value:_Promise});
    fn(resolve, reject);
    return promise;
}
