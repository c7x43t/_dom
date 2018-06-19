// CC: 329 byes
function fastApply(fn, args) {
    var fastSpread = [
        function(fn) {
            return fn();
        },
        function(fn, args) {
            return fn(args[0]);
        },
        function(fn, args) {
            return fn(args[0], args[1]);
        },
        function(fn, args) {
            return fn(args[0], args[1], args[2]);
        },
        function(fn, args) {
            return fn(args[0], args[1], args[2], args[3]);
        },
        function(fn, args) {
            return fn(args[0], args[1], args[2], args[3], args[4]);
        },
        function(fn, args) {
            return fn(args[0], args[1], args[2], args[3], args[4], args[5]);
        }
    ];
    var len = args.length;
    if (len <= 6) {
        return fastSpread[len](fn, args);
    } else {
        return fn.apply(null, args);
    }
}
