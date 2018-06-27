var PROMISE_STATUS = "[[PromiseStatus]]";
    var PROMISE_VALUE = "[[PromiseValue]]";
    var PENDING = "pending";
    var RESOLVED = "resolved";
    var REJECTED = "rejected";

    function _Promise(fn) {
        var fnThen = undef;
        var fnCatch = undef;
        var fnFinally = undef;
        var reason = undef;
        var self = this;

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

        function initialize(promise) {
            promise[PROMISE_STATUS] = PENDING;
            promise[PROMISE_VALUE] = undef;
            fnThen = undef;
            fnCatch = undef;
            fnFinally = undef;
            reason = undef;
        }
        var promise = {};
        Object.defineProperty(promise, "then", {
            value: _then
        });
        Object.defineProperty(promise, "finally", {
            value: _finally
        });
        Object.defineProperty(promise, "catch", {
            value: _catch
        });
        Object.defineProperty(promise, "constructor", {
            value: _Promise
        });
        initialize(promise);

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

        fn(resolve, reject);
        return promise;
    }
    var _promise = typeof Promise === UNDEFINED ? _Promise : $jscomp.global["Promise"];
    var promise = function(fn) {
        return new _promise(fn);
    };
