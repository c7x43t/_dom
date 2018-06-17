// very fast, minimal implementation of setImmediate polyfill using MutationObserver (4-10x faster than messageChannel)
// https://github.com/Octane/setImmediate/blob/master/setimmediate.js
// https://github.com/YuzuJS/setImmediate 
window.setImmediate = (function() {
    var stack = [];
    var handle = 1;
    var executing = false;
    var ids = {};

    function fastApply(fn, args) {
        var fastSpread = [
            function(fn) {
                fn();
            },
            function(fn, args) {
                fn(args[0]);
            },
            function(fn, args) {
                fn(args[0], args[1]);
            },
            function(fn, args) {
                fn(args[0], args[1], args[2]);
            },
            function(fn, args) {
                fn(args[0], args[1], args[2], args[3]);
            },
            function(fn, args) {
                fn(args[0], args[1], args[2], args[3], args[4]);
            },
            function(fn, args) {
                fn(args[0], args[1], args[2], args[3], args[4], args[5]);
            }
        ];
        var len = args.length;
        if (len <= 6) {
            fastSpread[len](fn, args);
        } else {
            fn.apply(null, args);
        }
    }

    function runner() {
        var item = stack.shift();
        if (ids.hasOwnProperty(item[2])) {
            window.clearImmediate(item[2]);
            fastApply(item[0], item[1]);
        }
        if (stack.length > 0) {
            run();
        } else {
            executing = false;
        }
    }
    var observer = new MutationObserver(runner);
    var observedElement = document.createElement('div');
    observer.observe(observedElement, {
        attributes: true
    });

    function run() {
        executing = true;
        observedElement.setAttribute('a', '');
    }
    window.clearImmediate = function(id) {
        ids[id] = null;
        delete ids[id];
    };
    return function() {
        var fn = arguments[0];
        var args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        /*if (stack.length >= 30) {
            runner();
        }*/
        stack.push([fn, args, handle]);
        ids[handle] = true;
        if (!executing) {
            run();
        }
        return handle++;
    };
})();
