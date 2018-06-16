// 1019 bytes minify
// 454 bytes minify + gz
const PROMISE_STATUS = "[[PromiseStatus]]",
PROMISE_VALUE = "[[PromiseValue]]",
PENDING = "pending",
RESOLVED = "resolved",
REJECTED = "rejected";


function initialize(bind){
    bind[PROMISE_VALUE] = undefined;
}
function resolve(value,self) {
    self[PROMISE_STATUS] = RESOLVED;
    self[PROMISE_VALUE] = value;
    if (self.link.then) {
        self.link.then(value);
        initialize(self);
    }
    if (self.link.finally) self.link.finally(); //?
}
function reject(reason,self) {
    self.reason = reason;
    self[PROMISE_STATUS] = REJECTED;
    self[PROMISE_VALUE] = reason;
    if (self.link.catch) {
        self.link.catch(reason);
        initialize(self);
    } else {
        throw reason;
    }
    if (self.link.finally) self.link.finally(); //?
}
function Promise(fn) {
    if(!(fn instanceof Function)){
        throw "Promise: parameter must be of type: function";
    }
    const self=this;
    //const link=new Link();
    //Object.defineProperty(this,"link",{value:link});
    this.link=new Link();
    this[PROMISE_STATUS] = PENDING;
    initialize(this);
    try{
        fn(function(value){
            resolve(value,self);
        }, function(value){
            reject(value,self);
        });
    }catch(err){
        console.error(err);
    }
    
}
function Link(){
    this.then=undefined;
    this.catch=undefined;
    this.finally=undefined;
    this.reason=undefined;
}
Promise.prototype.finally = function(fn){
    if (this[PROMISE_STATUS] !== PENDING) {
        fn();
    }
    this.link.finally = fn;
}
Promise.prototype.then = function(fn){
    if (this[PROMISE_STATUS] === RESOLVED) {
        fn(this[PROMISE_VALUE]);
        initialize(this);
    }
    this.link.then = fn;
    return this;

}
Promise.prototype.catch = function(fn){
    this.link.catch = fn;
    return this;
}
Promise.prototype.constructor = Promise;

//MINFIED
if("undefined"===typeof Promise)var a="[[PromiseStatus]]",b="[[PromiseValue]]",c="pending",d="resolved",e="rejected",u=void 0,f="Promise: parameter must be of type: function";function initialize(g){g[b]=u}function resolve(g,h){h[a]=d;h[b]=g;h.link.then&&(h.link.then(g),initialize(h));h.link["finally"]&&h.link["finally"]()}function reject(g,h){h.reason=g;h[a]=e;h[b]=g;if(h.link["catch"])h.link["catch"](g),initialize(h);else throw g;h.link["finally"]&&h.link["finally"]()}
function Promise(g){if(!(g instanceof Function))throw f;var h=this;this.link=new Link;this[a]=c;initialize(this);g(function(g){resolve(g,h)},function(g){reject(g,h)})}function Link(){this.reason=this["finally"]=this["catch"]=this.then=u}Promise.prototype["finally"]=function(g){this[a]!==c&&g();this.link["finally"]=g};Promise.prototype.then=function(g){this[a]===d&&(g(this[b]),initialize(this));this.link.then=g;return this};
Promise.prototype["catch"]=function(g){this.link["catch"]=g;return this};Promise.prototype.constructor=Promise;
