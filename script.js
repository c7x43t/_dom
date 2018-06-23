// CC 13.5 kBytes
// replace css methods with ie10+ compatible functions
// https://github.com/wilsonpage/fastdom | utilize in this script
// https://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
(function() {
    // POLYFILLS
    function indexOf(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item)
                return i;
        }
        return -1;
    }

    // ## private vars ##
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var NOOP = function NOOP() {};
    var UNDEFINED = "undefined";
    var undef = void 0;
    //var regexPreFilter = /[.#]?-?[_a-zA-Z]+?[_a-zA-Z0-9-]*/;
    //var regexSpaceFilter = / /;
    // ## private functions ##
    // SORTING
    var quickSort = function() {
        var i = 0;

        function swap(first, second, array) {
            var temp = array[first];
            array[first] = array[second];
            array[second] = temp;
        }
        return function(array) {
            for (var len = array.length - 1; i < len; i++) {
                if (array[i] > array[i + 1]) {
                    swap(i, i + 1, array);
                    i = -1;
                }
            }
            return array;
        };
    }();
    // CC 2.36 kBytes
    // String, Number, undefined, null, Set, Map, typed Array, Object, Boolean, RegExp, Date, ArrayBuffer, Node
    // Functions, Properties of types: (Primitive, Symbol)
    // shallow copy (by reference):
    // WeakMap, WeakSet, Symbol
    // increased compatibility: IE, Node
    // compatible with E API (_dom.js)
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.ASSUME_ES5 = !1;
    $jscomp.ASSUME_NO_NATIVE_MAP = !1;
    $jscomp.ASSUME_NO_NATIVE_SET = !1;
    $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
        a != Array.prototype && a != Object.prototype && (a[b] = c.value)
    };
    $jscomp.getGlobal = function(a) {
        return UNDEFINED != typeof window && window === a ? a : UNDEFINED != typeof global && null != global ? global : a
    };
    $jscomp.global = $jscomp.getGlobal(this);
    $jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
    $jscomp.initSymbol = function() {
        $jscomp.initSymbol = function() {};
        $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
    };
    $jscomp.Symbol = function() {
        var a = 0;
        return function(b) {
            return $jscomp.SYMBOL_PREFIX + (b || "") + a++;
        };
    }();
    $jscomp.initSymbolIterator = function() {
        $jscomp.initSymbol();
        var a = $jscomp.global.Symbol.iterator;
        a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
        "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
            configurable: !0,
            writable: !0,
            value: function() {
                return $jscomp.arrayIterator(this);
            }
        });
        $jscomp.initSymbolIterator = function() {};
    };
    $jscomp.arrayIterator = function(a) {
        var b = 0;
        return $jscomp.iteratorPrototype(function() {
            return b < a.length ? {
                done: !1,
                value: a[b++]
            } : {
                done: !0
            };
        });
    };
    $jscomp.iteratorPrototype = function(a) {
        $jscomp.initSymbolIterator();
        a = {
            next: a
        };
        a[$jscomp.global.Symbol.iterator] = function() {
            return this;
        };
        return a;
    };

    function isArray(arr) {
        $jscomp.initSymbol();
        $jscomp.initSymbolIterator();
        return arr[Symbol.iterator] instanceof Function;
    }

    function deepCopy(o) {
        if ((typeof o !== "object" || o === null) && !(o instanceof Function)) return o;
        var n, keys;
        var c = o.constructor;
        if (isArray(o)) {
            // Map and Set have no length property so they will be correctly constructed
            var l = o.length;
            n = (new c(l));
            switch (c.name) {
                case "Set":
                    o.forEach(function(e, i) {
                        n.add(deepCopy(e));
                    });
                    break;
                case "Map":
                    o.forEach(function(e, i) {
                        n.set(i, deepCopy(o.get(i)));
                    });
                    break;
            }
            fastMap(o, function(e, i) {
                n[i] = deepCopy(e);
            });
        } else {
            if (c.name !== "Object") {
                switch (c.name) {
                    case "Function":
                        var str = o.toString();
                        if (/ \[native code\] /.exec(str) === null) {
                            var args = /^.*?\((.*?)\)/.exec(str)[1]; //.split(/,/);
                            var func = /^.*?{(.*)}/.exec(str)[1];
                            n = new c(args, func);
                        } else {
                            n = o;
                        }
                        break;
                    case "RegExp":
                        n = new c(o.valueOf());
                        break;
                    case "Date":
                        n = new c(o);
                        break;
                    case "ArrayBuffer":
                        n = new c((new $jscomp.global["Int8Array"](o)).length);
                        break;
                    case "DOMRect":
                        n = {};
                        keys = ["bottom", "height", "left", "right", "top", "width", "x", "y"];
                        break;
                    default:
                        n = o instanceof Node ? o.cloneNode(true) : o;
                }
                keys = keys || Object.keys(o);
            } else {
                n = {};
                keys = Object.getOwnPropertyNames(o);
            }
            fastMap(keys, function(i) {
                n[i] = deepCopy(o[i]);
            });
        }
        if (Object.getOwnPropertySymbols) {
            fastMap(Object.getOwnPropertySymbols(o), function(i) {
                n[i] = deepCopy(o[i]);
            });
        }
        return n;
    }
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
    // PROMISE
    // CC: 857 bytes
    var PROMISE_STATUS = "[[PromiseStatus]]";
    var PROMISE_VALUE = "[[PromiseValue]]";
    var PENDING = "pending";
    var RESOLVED = "resolved";
    var REJECTED = "rejected";

    function _Promise(fn) {
        var fnThen = undef;
        var fnCatch = undef;
        var fnFinally = undef;
        var reason = undef;
        var self = this;

        function resolve(value) {
            promise[PROMISE_STATUS] = RESOLVED;
            promise[PROMISE_VALUE] = value;
            if (fnThen) {
                fnThen(value);
                initialize();
            }
            if (fnFinally) fnFinally(); //?
        }

        function reject(reason) {
            self.reason = reason;
            promise[PROMISE_STATUS] = REJECTED;
            promise[PROMISE_VALUE] = reason;
            if (fnCatch) {
                fnCatch(reason);
                initialize();
            } else {
                throw reason;
            }
            if (fnFinally) fnFinally(); //?
        }

        function initialize(promise) {
            promise[PROMISE_STATUS] = PENDING;
            promise[PROMISE_VALUE] = undef;
            fnThen = undef;
            fnCatch = undef;
            fnFinally = undef;
            reason = undef;
        }
        var promise = {};
        Object.defineProperty(promise, "then", {
            value: _then
        });
        Object.defineProperty(promise, "finally", {
            value: _finally
        });
        Object.defineProperty(promise, "catch", {
            value: _catch
        });
        Object.defineProperty(promise, "constructor", {
            value: _Promise
        });
        initialize(promise);

        function _then(fn) {
            if (promise[PROMISE_STATUS] === RESOLVED) {
                fn(promise[PROMISE_VALUE]);
                initialize();
            }
            fnThen = fn;
            return promise;
        }

        function _finally(fn) {
            if (promise[PROMISE_STATUS] !== PENDING) {
                fn();
            }
            fnFinally = fn;
            // what to return?
        }

        function _catch(fn) {
            if (promise[PROMISE_STATUS] === REJECTED) {
                fn(reason);
                throw reason;
            }
            fnCatch = fn;
            return promise;
        }

        fn(resolve, reject);
        return promise;
    }
    var _promise = typeof Promise === UNDEFINED ? _Promise : $jscomp.global["Promise"];
    var promise = function(fn) {
        return new _promise(fn);
    };
    // MEMOIZE
    // input: function, array of arguments, (optionally: true, if async function) 
    var memoize = (function() {
        var store = {};

        function objectChainGet(o, arr, i, l) {
            i = i || 0;
            arr = forceArray(arr);
            var pointer = o;
            for (l = l === undef ? arr.length : l; i < l - 1; i++) {
                if (typeof pointer[arr[i]] === UNDEFINED) {

                    objectChainInit(pointer, arr, i);
                }
                pointer = pointer[arr[i]];
            }
            i = arr.length - 1;
            var val = pointer[arr[i]];
            return {
                val: val,
                pointer: pointer
            };
        }

        function objectChainSet(o, arr, value) { // optimize: set is calling get a second time
            arr = forceArray(arr);
            objectChainGet(o, arr, 0, arr.length - 1)[arr[arr.length - 1]] = value;
        }

        function forceArray(arr) {
            return arr instanceof Array ? arr : [arr];
        }

        function objectChainInit(o, arr, i) {
            i = i || 0;
            var pointer = o;
            arr = forceArray(arr);
            for (i = i > 0 ? i-- : i; i < arr.length - 1; i++) {
                if (pointer[arr[i]] === undef) pointer[arr[i]] = {};
                pointer = pointer[arr[i]];
            }
        }
        return function(func, args, nonsync) {
            var val;
            nonsync = nonsync || false;
            args = forceArray(args);
            var value = objectChainGet(store, [func.name].concat(args));
            if (nonsync) {
                return new Promise(function(res, rej) {
                    if (value.val === undef) {
                        try {
                            val = fastApply(func, args);
                        } catch (err) {
                            rej(err);
                        }
                        value.pointer[args[args.length - 1]] = val;
                        res(val);
                    }
                    res(value.val);
                });
            }
            if (value.val === undef) {
                val = fastApply(func, args);
                value.pointer[args[args.length - 1]] = val;
                return val;
            }
            return value.val;
        };
    })();
    // CC 396 bytes
    // animationFrame - wrapper that executes a function at most 60 times/s
    // named functions will be processed faster
    function _animationFrame(fn) {
        var tolerance = 0.1;
        var fps = 60;
        var delay = 1e3 / fps;
        var lastTimeout = 0;
        var lastIteration = 0;
        var args;

        function iteration() {
            lastIteration = now();
            fastApply(fn, args);
        }

        function run() {
            var thisIteration = now();
            args = arguments;
            if (thisIteration - lastIteration > delay - tolerance) {
                clearTimeout(lastTimeout);
                iteration();
            } else {
                lastTimeout = setTimeout(iteration, delay % (thisIteration - lastIteration));
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
    // COOKIES
    function getCookies() {
        var cookies = {};
        var cookie;
        document.cookie.split(/; */).map(function(e) {
            cookie = e.split("=");
            cookies[cookie[0]] = cookie[1];
        });
        return cookies;
    }

    function getCookie(name) {
        return getCookies()[name];
    }

    function setCookie(name, value) {
        document.cookie = name + "=" + value;
    }

    function existsCookie(name) {
        return !!getCookie(name);
    }
    // FORM SERIALIZATION
    function serializeToObject(form) {
        // takes string, Node or NodeList (first Element)
        form = form instanceof Node ? form : form instanceof NodeList ? form[0] : E(form)[0];
        if (!form || form.nodeName !== "FORM") return;
        var el,
            op,
            obj = {},
            name,
            type,
            value,
            node;
        fastMap(form.elements, function(el) {
            name = el.name;
            if (name !== "") {
                type = el.type;
                value = el.value;
                node = el.nodeName;
                if (/INPUT/.exec(node) && (/text|hidden|password|button|reset|submit/.exec(type) || /checkbox|radio/.exec(type) && el.checked) || /TEXTAREA/.exec(node) || /SELECT/.exec(node) && /select-one/.exec(node) || /BUTTON/.exec(node) && /reset|submit|button/.exec(type)) {
                    obj[name] = encodeURIComponent(value);
                } else if (/SELECT/.exec(node) && /select-multiple/.exec(node)) {
                    fastMap(el.options, function(op) {
                        if (op.selected) {
                            obj[name] = encodeURIComponent(op.value);
                        }
                    });
                }
            }
        });
        return obj;
    }

    function serializeObject(obj) {
        var str = "";
        fastMap(obj, function(el, key) {
            str += key + "=" + obj[key] + "&";
        });
        str = str.slice(0, str.length - 1);
        return str;
    }
    // fast functions based on: https://github.com/codemix/fast.js/
    // # fast Map
    function fastMap(subject, fn, test) {
        var length, result, i, keys;
        if (subject instanceof Array || subject instanceof NodeList) {
            // Array map
            length = subject.length;
            result = new Array(length);
            if (!test) {
                for (i = 0; i < length; i++) {
                    result[i] = fn(subject[i], i, subject);
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (test(subject[i])) break;
                    result[i] = fn(subject[i], i, subject);
                }
            }
            return equipArray(result);
        } else {
            // Object map
            keys = Object.keys(subject);
            length = keys.length;
            result = {};
            if (!test) {
                for (i = 0; i < length; i++) {
                    result[keys[i]] = fn(subject[keys[i]], keys[i], subject);
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (test(subject[keys[i]])) break;
                    result[keys[i]] = fn(subject[keys[i]], keys[i], subject);
                }
            }
            return result;
        }
    }

    function forEach(subject, fn, test) {
        fastMap(subject, fn, test);
        return equipArray(subject);
    }
    // # fast Reduce
    function fastReduce(subject, fn, initialValue, test) {
        var length, i, result, keys;
        if (subject instanceof Array || subject instanceof NodeList) {
            // Array reduce
            length = subject.length;
            if (initialValue === undef) {
                i = 1;
                result = subject[0];
            } else {
                i = 0;
                result = initialValue;
            }
            if (!test) {
                for (; i < length; i++) {
                    result = fn(result, subject[i], i, subject);
                }
            } else {
                for (; i < length; i++) {
                    if (test(subject[i])) break;
                    result = fn(result, subject[i], i, subject);
                }
            }
        } else {
            // Object reduce
            keys = Object.keys(subject);
            length = keys.length;
            if (initialValue === undef) {
                i = 1;
                result = subject[keys[0]];
            } else {
                i = 0;
                result = initialValue;
            }
            if (!test) {
                for (; i < length; i++) {
                    result = fn(result, subject[keys[i]], keys[i], subject);
                }
            } else {
                for (; i < length; i++) {
                    if (test(subject[keys[i]])) break;
                    result = fn(result, subject[keys[i]], keys[i], subject);
                }
            }
        }
        return result;
    }
    // # fast Filter
    function fastFilter(subject, fn, test) {
        var length, result, i, keys;
        if (subject instanceof Array || subject instanceof NodeList) {
            // Array filter
            length = subject.length;
            result = [];
            if (!test) {
                for (i = 0; i < length; i++) {
                    if (fn(subject[i], i, subject)) {
                        result.push(subject[i]);
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (test(subject[i])) break;
                    if (fn(subject[i], i, subject)) {
                        result.push(subject[i]);
                    }
                }
            }
            return equipArray(result);
        } else {
            // Object filter
            keys = Object.keys(subject);
            length = keys.length;
            result = {};
            if (!test) {
                for (i = 0; i < length; i++) {
                    if (fn(subject[keys[i]], keys[i], subject)) {
                        result[keys[i]] = subject[keys[i]];
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (test(subject[keys[i]])) break;
                    if (fn(subject[keys[i]], keys[i], subject)) {
                        result[keys[i]] = subject[keys[i]];
                    }
                }
            }
            return result;
        }
    }
    // faster than querySelectorAll (in most cases) #broken
    function fastQuery(el, selector) {
        return el.querySelectorAll(selector);
        /*return (!(selector instanceof Node || selector instanceof NodeList)) ? el.querySelectorAll(selector) : selector; //fix '[name=value]' add "," fix :hover
        var nodeList;
        if (regexPreFilter.exec(selector) && !regexSpaceFilter.exec(selector)) {
            if (selector[0] === ".") {
                nodeList = el.getElementsByClassName(selector.replace('.', ''));
            } else if (selector[0] === "#") {
                nodeList = el.getElementById(selector.replace('#', ''));
                nodeList = nodeList instanceof Node ? [nodeList] : document.createDocumentFragment().childNodes;
            } else {
                nodeList = el.getElementsByTagName(selector);
            }
        } else {
            nodeList = el.querySelectorAll(selector);
        }
        return nodeList; //nodeList.hasOwnProperty("length")?nodeList:[nodeList];*/
    }
    // fullscreen API from: https://davidwalsh.name/fullscreen
    function launchIntoFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    function toggleFullscreen(element) {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
            exitFullscreen();
        } else {
            launchIntoFullscreen(element);
        }
    }

    // EventListener
    function on(el, str, fn, op) {
        var noDefault = function noDefault(e) {
            e.preventDefault();
            return fn;
        };
        fastMap(str.split(" "), function(e) {
            return el.addEventListener(e, op === true ? noDefault : fn, op instanceof Object ? op : undef);
        });
        return el;
    }

    function off(el, str, fn) {
        fastMap(str.split(" "), function(e) {
            return el.removeEventListener(e, fn);
        });
        return el;
    }
    // AJAX
    function post(url, data) {
        return ajax({
            type: "POST",
            url: url,
            data: data
        });
    }

    function get(url) {
        return ajax({
            type: "GET",
            url: url
        });
    }

    function getJSON(url) {
        return get(url)
            .then(function(e) {
                return JSON.parse(e);
            });
    }

    function ajax(data) {
        return promise(function(res, rej) {
            var req = new XMLHttpRequest();
            req.open(data.type, data.url, true);
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status >= 200 && req.status < 400) {
                        res(req.response);
                    } else {
                        // We reached our target server, but it returned an error
                    }
                    req = null;
                }
            };
            req.onerror = function(e) {
                rej(e);
            };
            if (data.beforeSend) {
                data.beforeSend(req);
            }
            if (data.type === "POST") {
                req.send(data.data);
            } else {
                req.send();
            }
        });
    }
    // get image dimensions
    function getImgSize(imgSrc) {
        if (imgSrc instanceof Node) {
            imgSrc = imgSrc.src;
        }
        var newImg = new Image();
        return promise(function(res, rej) {
            newImg.onload = function() {
                res({
                    width: newImg.width,
                    height: newImg.height
                });
                newImg = null; // enable GC
            };
            newImg.onerror = function(err) {
                rej(err);
            };
            newImg.src = imgSrc;
        });
    }
    // equip object
    function equipObject(obj) {
        obj = equipArray(obj);
        if (!!obj.addEventListener) obj.on = function(str, fn, bool) {
            on(obj, str, fn, bool);
        };
        if (!!obj.removeEventListener) obj.off = function(str, fn) {
            off(obj, str, fn);
        };
        return obj;
    }
    // equip event
    function equipEvent(e) {
        return e;
    }
    // equip single
    function equipSingle(node) {
        node.on = function(str, fn, bool) {
            on(node, str, fn, bool);
        };
        node.off = function(str, fn) {
            off(node, str, fn);
        };
        node.find = function(selector) {
            fastQuery(node, selector);
        };
        return node;
    }
    // equip Array 
    function equipArray(arr) {
        arr.map = function(fn, cond) {
            fastMap(arr, fn, cond);
        };
        arr.forEach = function(fn, cond) {
            forEach(arr, fn, cond);
        };
        arr.reduce = function(fn, init, cond) {
            fastReduce(arr, fn, init, cond);
        };
        arr.filter = function(fn, cond) {
            fastFilter(arr, fn, cond);
        };
        return arr;
    }
    // equip nodeList
    function equip(nodeList) {
        nodeList = equipArray(nodeList);
        nodeList.html = function(str) {
            // experimental
            nodeList.map(function(el) {
                return str ? el.innerHTML = str : el.innerHTML;
            });
            return nodeList;
        };
        nodeList.on = function(str, fn, bool) {
            fastMap(nodeList, function(el) {
                on(el, str, fn, bool);
            });
            return nodeList;
        };
        nodeList.off = function(str, fn) {
            fastMap(nodeList, function(el) {
                off(el, str, fn);
            });
        };
        nodeList.click = function(fn, bool) {
            nodeList.on("click", fn, bool);
            return nodeList;
        };
        nodeList.get = function(n) {
            return equipSingle(nodeList[n]);
        };
        nodeList.first = function() {
            return nodeList.get(0);
        };
        nodeList.last = function() {
            return nodeList.get(nodeList.length - 1);
        };
        nodeList.parent = function() {
            return equip(fastMap(nodeList, function(e) {
                return e.parentElement;
            }));
        };
        // faster replace operations - EXPERIMENTAL
        // {fn} must return an element
        nodeList.map.replace = function(fn) {
            var nodes = Array.from(nodeList);
            E.map(nodes, function(e) {
                var k = e.cloneNode(true);
                fn(k);
                //list.push(k);
                e.parentNode.replaceChild(k, e);
            });
            E.map(nodes, function(e, i) {
                //e.parentNode.replaceChild(list[i], e);
            });
        };
        return nodeList;
    }

    function fireEvent(el, name) {
        if (!name) {
            name = el;
            el = document;
        }
        var event;
        if (document.createEvent) {
            if (Event) {
                event = new Event(name);
            } else {
                event = document.createEvent("Event");
                event.initEvent(name, true, true);
            }
            event.eventName = name;
            el.dispatchEvent(event);
        } else {
            event = document.createEventObject();
            event.eventType = name;
            event.eventName = name;
            el.fireEvent("on" + event.eventType, event);
        }
    }
    // main
    var E = function E(selector) {
        //nodeList = typeof selector === "string" ? fastQuery(document, selector) : selector;
        //return equip(nodeList);
        if (typeof selector === "string") {
            return equip(fastQuery(document, selector));
        } else if (selector instanceof NodeList) {
            return equip(selector);
        } else if (selector instanceof Node) {
            return equipSingle(selector);
        } else if (selector instanceof Event) {
            return equipEvent(selector);
        } else if ((typeof selector === UNDEFINED ? UNDEFINED : _typeof(selector)) === "object") {
            return equipObject(selector);
        }
    };
    // ## public vars ##
    E.mouse = {}; // keep track of mouse position
    on(document, "mousemove", function(e) {
        E.mouse = {
            x: e.x,
            y: e.y,
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY
        };
    });
    E.scroll = {
        top: 0,
        left: 0
    };
    on(window, "scroll load", function(e) {
        E.scroll = {
            top: window.pageYOffset,
            left: window.pageXOffset,
            dtop: window.pageYOffset - E.scroll.top,
            dleft: window.window.pageXOffset - E.scroll.left
        };
    });
    E.size = {};
    on(window, "resize load", function(e) {
        E.size = {
            width: document.documentElement.clientWidth || body.clientWidth,
            height: document.documentElement.clientHeight || body.clientHeight
        };
    });
    E.event = fireEvent;
    // pass <Element> or result from el.getBoundingClientRect<Object>
    E.over = function(el) {
        // test if mouse is over element 
        var rect = el instanceof Node ? el.getBoundingClientRect() : el;
        var x = E.mouse.x;
        var y = E.mouse.y;
        return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
    };
    E.addClass = function(el, className) {
        if (el.classList) el.classList.add(className);
        else el.className += ' ' + className;
    };
    E.is = function(el, sel) {
        var _matches = (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector);

        if (_matches) {
            return _matches.call(el, sel);
        } else {
            var nodes = el.parentNode.querySelectorAll(sel);
            for (var i = nodes.length; i--;) {
                if (nodes[i] === el)
                    return true;
            }
            return false;
        }
    };
    E.removeClass = function(el, className) {
        if (el.classList) el.classList.remove(className);
        else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };
    E.hasClass = function(el, className) {
        if (el.classList) return el.classList.contains(className);
        else return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    };
    E.toggleClass = function(el, className) {
        return E.hasClass(el, className) ? E.removeClass(el, className) : E.addClass(el, className);
    };
    /*E.isHover = e => { // propably useless
        return fastReduce(e.parentElement.querySelectorAll(':hover'), (acc, t) => e === t || acc, false);
    };*/
    E.style = function(el, pseudo) {
        return window.getComputedStyle(el, pseudo ? pseudo : null);
    }; //legacy
    E.after = function(el, str) {
        return el.insertAdjacentHTML('afterend', str);
    };
    E.before = function(el, str) {
        return el.insertAdjacentHTML('beforebegin', str);
    };
    E.append = function(el, child) {
        return el.appendChild(child);
    };
    E.prepend = function(el, child) {
        return el.insertBefore(child, el.firstChild);
    };
    E.remove = function(el) {
        return el.parentNode.removeChild(el);
    };
    E.replace = function(el, str) {
        el.outerHTML = str;
    };
    E.clone = function(el) {
        return deepCopy(el);
    };
    E.emptyText = function(el) {
        el.innerHTML = '';
    };
    E.empty = function(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    };
    // apply
    E.apply = fastApply;
    // memoize
    E.memoize = memoize;
    // Promise
    E.promise = promise;
    // animationFrame
    E.animationFrame = (new animationFrame()).exec;
    // Attributes get/set/remove
    E.attr = function(el, name, value) {
        return value || value === "" ? value === null ? el.removeAttribute(name) : el.setAttribute(name, value) : el.getAttribute(name);
    };
    E.css = function(el, name, value) {
        name = name.namereplace(/(-\w+)/g, function(e) {
            return e.charAt(1).toUpperCase() + e.substr(2).toLowerCase();
        });
        return value && value[0] !== ":" ? el.style[name] = value : getComputedStyle(el, value ? value : null)[name];
    };
    E.html = function(el, str) {
        return str ? el.innerHTML = str : el.innerHTML;
    };
    E.text = function(el, str) {
        var text = Element.prototype.textContent ? "textContent" : "innerText";
        return str ? el[text] = str : el[text];
    };

    function nextElementSibling(el) {
        do {
            el = el.nextSibling;
        } while (el && el.nodeType !== 1);
        return el;
    }
    E.next = function(el) {
        // nextSibling can include text nodes
        return el.nextElementSibling || nextElementSibling(el);
    };
    // prevSibling can include text nodes
    function previousElementSibling(el) {
        do {
            el = el.previousSibling;
        } while (el && el.nodeType !== 1);
        return el;
    }
    E.prev = function(el) {
        return el.previousElementSibling || previousElementSibling(el);
    };
    /*E.scroll = e => {
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        }
    }*/
    E.offset = function(el) {
        return el.getBoundingClientRect();
    };
    E.parent = function(e) {
        return e.parentNode;
    };
    E.siblings = function(e) {
        return fastFilter(e.parentNode.children, function(child) {
            return child !== e;
        });
    };
    E.position = function(e) {
        return {
            left: e.offsetLeft,
            top: e.offsetTop
        };
    };
    E.find = function(el, selector) {
        return fastQuery(el, selector);
    };
    E.exists = function(e) {
        var el = E(e);
        return el.length && el.length > 0;
    };
    // DOMReady event // # integrate on top - remove here
    E.ready = function(fn) {
        return E(document).on("DOMContentLoaded", fn);
    };
    E.load = function(fn) {
        return document.readyState === "complete" ? fn() : on(window, "load", fn);
    };
    //
	function now() {
        return new Date().getTime();
    }
    E.now = now;
    E.type = function(obj) {
        return obj.constructor.name.toLowerCase();
    };
    // cookies
    E.getCookies = getCookies;
    E.getCookie = getCookie;
    E.setCookie = setCookie;
    E.existsCookie = existsCookie;
    // ajax
    E.ajax = ajax;
    E.get = get;
    E.getJSON = getJSON;
    E.post = post;
    // imageSize
    E.getImgSize = function(e){
		return memoize(getImgSize,e);
	};
    // fullscreen
    E.enterFullscreen = launchIntoFullscreen;
    E.exitFullscreen = exitFullscreen;
    E.toggleFullscreen = toggleFullscreen;
    // local/session Storage
    E.session = function(name, value) {
        return value ? sessionStorage.setItem(name, value) : sessionStorage.getItem(name);
    };
    E.local = function(name, value) {
        return value ? localStorage.setItem(name, value) : localStorage.getItem(name);
    };
    // export map-reduce
    E.map = fastMap;
    E.forEach = forEach;
    E.reduce = fastReduce;
    E.filter = fastFilter;
    // export
    window.E = E;
})();
