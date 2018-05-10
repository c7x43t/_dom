// very fast minimal implementation of setImmediate polyfill using MutationObserver (4-10x faster than messageChannel)
// lacks currently: returning proper handle => window.clearImmediate
// fix: missing arguments: setImmediate(fn,...args)
// it works as expected otherwise, executing passed function async and in order
var setImmediate=(function setImmediateFactory(){
    let resolver=function(){};
    let nextHandle = 1;
    let executing = false;
    let stack=[];
    let observer = new (MutationObserver || WebKitMutationObserver)(function(){ 
        resolver();
        if(stack.length>0){
            run(stack.shift());
        }else{
            executing=false;
        }
    });
    let observedElement = document.createElement('div');
    observer.observe(observedElement, { attributes: true });
    function run(fn){
        resolver = fn;
        observedElement.setAttribute('a', '');
    }
    return function setImmediate(fn){
        if(executing){
            stack.push(fn);
        }else{
            executing=true;
            run(fn);
        }
        return nextHandle++;
    }
})();
