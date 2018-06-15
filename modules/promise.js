// 694 bytes minify
// 377 bytes minify + gz
if(typeof Promise === "undefined"){
	const PROMISE_STATUS = "[[PromiseStatus]]",
		PROMISE_VALUE = "[[PromiseValue]]",
		PENDING = "pending",
		RESOLVED = "resolved",
		REJECTED = "rejected";
	function Promise(fn) {
		if(!(fn instanceof Function)){
			throw "Promise: parameter must be of type: function";
		}
		
		let fnThen,
			fnCatch,
			fnFinally,
			reason,
			self;
		//let self = this;
		function initialize(bind){
			bind[PROMISE_VALUE] = void 0;
		}
		function resolve(value) {
			self[PROMISE_STATUS] = RESOLVED;
			self[PROMISE_VALUE] = value;
			if (fnThen) {
				fnThen(value);
				initialize(self);
			}
			if (fnFinally) fnFinally(); //?
		}
		function reject(reason) {
			self.reason = reason;
			self[PROMISE_STATUS] = REJECTED;
			self[PROMISE_VALUE] = reason;
			if (fnCatch) {
				fnCatch(reason);
				initialize(self);
			} else {
				throw reason;
			}
			if (fnFinally) fnFinally(); //?
		}
		function Promise() {
			self=this;
			this[PROMISE_STATUS] = PENDING;
			initialize(this);
			fn(resolve, reject);
		}
		Promise.prototype.finally = function(fn){
			if (this[PROMISE_STATUS] !== PENDING) {
				fn();
			}
			fnFinally = fn;
		}
		Promise.prototype.then = function(fn){
			if (this[PROMISE_STATUS] === RESOLVED) {
				fn(this[PROMISE_VALUE]);
				initialize(this);
			}
			fnThen = fn;
			return this;

		}
		Promise.prototype.catch = function(fn){
			if (this[PROMISE_STATUS] === REJECTED) {
				fn(reason);
				throw reason;
			}
			fnCatch = fn;
			return this;
		}
		Promise.prototype.constructor = Promise;
		
		return new Promise();
	}
}

//MINFIED
if("undefined"===typeof Promise)var Promise$0=function(n){function p(e){g[a]=d;g[b]=e;l&&(l(e),g[b]=void 0);k&&k()}function q(e){g.reason=e;g[a]=f;g[b]=e;if(m)m(e),g[b]=void 0;else throw e;k&&k()}function h(){g=this;this[a]=c;this[b]=void 0;n(p,q)}if(!(n instanceof Function))throw"Promise: parameter must be of type: function";var l,m,k,g;h.prototype["finally"]=function(e){this[a]!==c&&e();k=e};h.prototype.then=function(e){this[a]===d&&(e(this[b]),this[b]=void 0);l=e;return this};h.prototype["catch"]=
function(e){if(this[a]===f)throw e(void 0),void 0;m=e;return this};h.prototype.constructor=h;return new h},a="[[PromiseStatus]]",b="[[PromiseValue]]",c="pending",d="resolved",f="rejected";
