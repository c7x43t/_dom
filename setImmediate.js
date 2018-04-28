// FF, chrome, IE11
(function (global, undefined) {
    "use strict";

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      args.map((e,i)=>e=arguments[i+1]);
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        var l=args.length;
        if(l===0) callback();
        if(l===1) callback(args[0]);
        if(l===2) callback(args[0], args[1]);
        if(l===3) callback(args[0], args[1], args[2]);
        if(!(l>=0&&l<=3)) callback.apply(undefined, args);
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }
    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            runIfPresent(event.data);
        };
        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }
    installMessageChannelImplementation();
    global.setImmediate = setImmediate;
    global.clearImmediate = clearImmediate;
}(this));
