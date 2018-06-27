// very fast, minimal implementation of setImmediate polyfill using MutationObserver (4-10x faster than messageChannel)
// https://github.com/Octane/setImmediate/blob/master/setimmediate.js
// https://github.com/YuzuJS/setImmediate 
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
(function() {
    var stack = [];
    var handle = 1;
    var executing = false;
    var ids = {};
    var shift = [].shift;
    var implementation;

    function runner() {
        var item = stack.shift();
        if (ids.hasOwnProperty(item[2])) {
            window.clearImmediate(item[2]);
            fastApply(item[0], item[1]);
        }
        if (stack.length > 0) {
            run[implementation]();
        } else {
            executing = false;
        }
    }
    if (MutationObserver) {
        var observer = new MutationObserver(runner);
        var observedElement = document.createElement('div');
        observer.observe(observedElement, {
            attributes: true
        });
        implementation = 0;
    } else if (MessageChannel) {
        var channel = new MessageChannel();
        channel.port1.onmessage = runner;
        channel.port1.start();
        channel.port2.start();
        implementation = 1;
    }

    var run = [function() {
        executing = true;
        observedElement.setAttribute('a', '');
    }, function() {
        executing = true;
        channel.port2.postMessage('');
    }]
    window.clearImmediate = function(id) {
        ids[id] = null;
        delete ids[id];
    };
    try {
        if (!window.setImmediate) {
            window.setImmediate = function() {
                arguments.shift = shift;
                var fn = arguments.shift();
                stack.push([fn, arguments, handle]);
                //for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
                /*if (stack.length >= 30) {
                	runner();
                }*/
                ids[handle] = true;
                if (!executing) {
                    run[implementation]();
                }
                return handle++;
            };
        }
    } catch (e) {}
})();
