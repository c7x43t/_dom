// very fast minimal implementation of setImmediate polyfill using MutationObserver (4-10x faster than messageChannel)
var setImmediate=(function setImmediateFactory(){
    let resolver=function(){};
    let observer = new (MutationObserver || WebKitMutationObserver)(function(){ resolver() });
    let observedElement = document.createElement('div');
    observer.observe(observedElement, { attributes: true });

    return function setImmediateObserver(fn){
        resolver = fn;
        observedElement.setAttribute('a', '');
    }
})();
