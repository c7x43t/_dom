// very fast minimal implementation of setImmediate polyfill using MutationObserver (4-10x faster than messageChannel)
// lacks currently: returning proper handle => window.clearImmediate
// it works as expected otherwise, executing passed function async and in order
var setImmediate=(function setImmediateFactory(){
    let resolver=function(){};
    let args=[];
    let nextHandle = 1;
    let executing = false;
    let stack=[];
    let observer = new (MutationObserver || WebKitMutationObserver)(function(){ 
        resolver(...args);
        if(stack.length>0){
            let item=stack.shift();
            run(item[0],item[1]);
        }else{
            executing=false;
        }
    });
    let observedElement = document.createElement('div');
    observer.observe(observedElement, { attributes: true });
    function run(fn,_args){
        resolver = fn;
        args=_args;
        observedElement.setAttribute('a', '');
    }
    return function setImmediate(){
        let fn=arguments[0];
        let _args=Array.apply(null, Array(arguments.length-1)).map((e,i)=>arguments[i+1]);
        if(executing){
            stack.push([fn,args]);
        }else{
            executing=true;
            run(fn,_args);
        }
        return nextHandle++;
    }
})();
