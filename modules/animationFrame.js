// CC 396 bytes
// animationFrame - wrapper that executes a function at most 60 times/s at an exact frequency of 1/60 1/s
// named functions will be processed faster
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
