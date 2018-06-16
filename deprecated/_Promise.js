const _Promise_STATUS = "[[_PromiseStatus]]",
_Promise_VALUE = "[[_PromiseValue]]",
PENDING = "pending",
RESOLVED = "resolved",
REJECTED = "rejected";


function initialize(bind){
    bind[_Promise_VALUE] = undefined;
}
function resolve(value,self) {
    self[_Promise_STATUS] = RESOLVED;
    self[_Promise_VALUE] = value;
    if (self.link.then) {
        self.link.then(value);
        initialize(self);
    }
    if (self.link.finally) self.link.finally(); //?
}
function reject(reason,self) {
    self.reason = reason;
    self[_Promise_STATUS] = REJECTED;
    self[_Promise_VALUE] = reason;
    if (self.link.catch) {
        self.link.catch(reason);
        initialize(self);
    } else {
        throw reason;
    }
    if (self.link.finally) self.link.finally(); //?
}
function _Promise(fn) {
    if(!(fn instanceof Function)){
        throw "_Promise: parameter must be of type: function";
    }
    const self=this;
    //const link=new Link();
    //Object.defineProperty(this,"link",{value:link});
    this.link=new Link();
    this[_Promise_STATUS] = PENDING;
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
_Promise.prototype.finally = function(fn){
    if (this[_Promise_STATUS] !== PENDING) {
        fn();
    }
    this.link.finally = fn;
}
_Promise.prototype.then = function(fn){
    if (this[_Promise_STATUS] === RESOLVED) {
        fn(this[_Promise_VALUE]);
        initialize(this);
    }
    this.link.then = fn;
    return this;

}
_Promise.prototype.catch = function(fn){
    this.link.catch = fn;
    return this;
}
_Promise.prototype.constructor = _Promise;
