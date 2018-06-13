// CC 396 bytes
// animationFrame - wrapper that executes a function at most 60 times/s
// named functions will be processed faster
var animationFrame = (function() {
    var initTime = 0;
    var iterations = 0;
    var store = {};
    var delay;
    var lastTimeout = 0;
    var lastIteration;
    var ips;

    function calcIPS(isIteration) {
        var t = (new Date()).getTime();
        if (isIteration) {
            lastIteration = t;
        }
        ips = iterations / (lastIteration - initTime) * 1e3;
        if (ips < 60) {
            delay = 15;
        } else {
            delay = 17;
        }
        return t;
    }

    function iteration() {
        var keys = Object.keys(store);
        for (var i = 0; i < keys.length; i++) {
            store[keys[i]]();
        }
        store = {};
        iterations++;
        calcIPS(true);
        lastTimeout = setTimeout(iteration, delay);
    }

    function queue(fn) {
        var name = fn.name;
        if (name === "") {
            name = fn.toString();
        }
        if (!store.hasOwnProperty(name)) {
            store[name] = fn;
        }
        if ((calcIPS(false) - lastIteration) > delay) {
            clearTimeout(lastTimeout);
            iteration();
        }
    }
    initTime = (new Date()).getTime();
    iteration(true);
    return queue;
})();
