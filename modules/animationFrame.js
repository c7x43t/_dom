// CC 396 bytes
// executes a function at most 60 times/s at an exact frequency of 1/60 1/s
// calling this function ensures execution (once), but it may be delayed due to rate limitation
// usage: animationFrame(myFunc,args);
// note: named functions will be processed faster
global.animationFrame = (function() {
    function _animationFrame(fn) {
        var tolerance = 0.1;
        var fps = 60;
        var delay = 1e3 / fps;
        var lastTimeout = 0;
        var lastIteration = 0;
        var args;

        function iteration() {
            lastIteration = +new Date;
            fastApply(fn, args);
        }

        function run() {
            var thisIteration = +new Date;
            args = arguments;
            if (thisIteration - lastIteration > delay - tolerance) {
                clearTimeout(lastTimeout);
                iteration();
            } else {
                lastTimeout = setTimeout(iteration, delay % (thisIteration - lastIteration))
            }
        }
        this.run = run;
    }

    function animationFrame() {
        store = {};

        function exec(fn, args) {
            var name = fn.name !== "" ? fn.name : fn.toString();
            if (!store.hasOwnProperty(name)) {
                store[name] = new _animationFrame(fn);
            }
            store[name].run(args);
        }
        this.exec = exec;
    }
    return (new animationFrame).exec;
}());
