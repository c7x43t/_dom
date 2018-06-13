function fastApply(fn, args) {
    var fastSpread = {
        0: function(fn) {
            fn();
        },
        1: function(fn, args) {
            fn(args[0]);
        },
        2: function(fn, args) {
            fn(args[0], args[1]);
        },
        3: function(fn, args) {
            fn(args[0], args[1], args[2]);
        },
        4: function(fn, args) {
            fn(args[0], args[1], args[2], args[3]);
        },
        5: function(fn, args) {
            fn(args[0], args[1], args[2], args[3], args[4]);
        },
        6: function(fn, args) {
            fn(args[0], args[1], args[2], args[3], args[4], args[5]);
        }
    };
    var len = args.length;
    if (len <= 6) {
        fastSpread[len](fn, args);
    } else {
        fn.apply(undefined, args);
    }
}
