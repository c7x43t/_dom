// replace css methods with ie10+ compatible functions
// https://github.com/wilsonpage/fastdom | utilize in this script
// https://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
(function() {
    // ## private vars ##
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var NOOP = function NOOP() {};
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
    // DEEP CLONING
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
            if (initialValue === undefined) {
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
            if (initialValue === undefined) {
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
            return el.addEventListener(e, op === true ? noDefault : fn, op instanceof Object ? op : undefined);
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
    function post(url, data, success, error) {
        ajax({
            type: "POST",
            url: url,
            success: success,
            error: error,
            data: data
        });
    }

    function get(url, success, error) {
        ajax({
            type: "GET",
            url: url,
            success: success,
            error: error
        });
    }

    function getJSON(url, success, error) {
        return get(url, function(e) {
            return success(JSON.parse(e));
        }, error);
    }

    function ajax(data) {
        if (!data.success) data.success = NOOP;
        if (!data.error) data.error = NOOP;
        var req = new XMLHttpRequest();
        req.open(data.type, data.url, true);
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status >= 200 && req.status < 400) {
                    data.success(req.response);
                } else {
                    // We reached our target server, but it returned an error
                }
                req = null;
            }
        };
        req.onerror = data.error;
        if (data.beforeSend) {
            data.beforeSend(req);
        }
        return data.type === "POST" ? req.send(data.data) : req.send();
    }
    // get image dimensions
    function getImgSize(imgSrc, callback) {
        var newImg = new Image();
        newImg.onload = function() {
            if (callback) {
                callback({
                    width: newImg.width,
                    height: newImg.height
                });
            }
            newImg = null; // enable GC
        };
        newImg.src = imgSrc;
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
        } else if ((typeof selector === "undefined" ? "undefined" : _typeof(selector)) === "object") {
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
            left: window.pageXOffset
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
    E.over = function(el) {
        // test if mouse is over element
        var rect = el.getBoundingClientRect();
        var x = E.mouse.x;
        var y = E.mouse.y;
        return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
    };
    E.addClass = function(el, className) {
        if (el.classList) el.classList.add(className);
        else el.className += ' ' + className;
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
        return el.outerHTML = str;
    };
    E.clone = function(el) {
        return el.cloneNode(true);
    };
    E.empty = function(el) {
        return el.innerHTML = '';
    };
    /*// Attributes get/set
    E.attr = (el, name, value) => value || value === "" ? el.setAttribute(name, value) : el.getAttribute(name);*/
    E.css = function(el, name, value) {
        return value && value[0] !== ":" ? el.style[name] = value : getComputedStyle(el, value ? value : null)[name];
    };
    E.html = function(el, str) {
        return str ? el.innerHTML = str : el.innerHTML;
    };
    E.text = function(el, str) {
        return str ? el.textContent = str : el.textContent;
    };
    E.next = function(el) {
        return el.nextElementSibling;
    };
    E.prev = function(el) {
        return el.previousElementSibling;
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
        return !!el.length && el.length > 0;
    };
    // DOMReady event // # integrate on top - remove here
    E.ready = function(fn) {
        return E(document).on("DOMContentLoaded", fn);
    };
    E.load = function(fn) {
        return document.readyState === "complete" ? fn() : on(window, "load", fn);
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
    E.getImgSize = getImgSize;
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
