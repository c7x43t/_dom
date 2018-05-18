(() => {
    // ## private vars ##
    var NOOP = () => {};
    var regexPreFilter = /[.#]?-?[_a-zA-Z]+?[_a-zA-Z0-9-]*/;
    var regexSpaceFilter = / /;
    // ## private functions ##
    // SORTING
    const quickSort = (function() {
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
    })();
    // DEEP CLONING
    function deepCopy(o) {
        if (typeof o !== "object" || o === null) return o; // fast obj/null test
        let n;
        if (o instanceof Array) { // fast array test
            const l = o.length;
            n = [];
            for (let i = 0; i < l; i++) n[i] = deepCopy(o[i]);
            return n;
        }
        n = {};
        for (let i in o)
            if (!!o[i]) n[i] = deepCopy(o[i]); // fast hasProperty test
        return n;
    }
    // COOKIES
    function getCookies() {
        const cookies = {};
        let cookie;
        document.cookie.split(/; */).map(e => {
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
    function serializeToObject(form) { // takes string, Node or NodeList (first Element)
        form = form instanceof Node ? form : form instanceof NodeList ? form[0] : $$(form)[0];
        if (!form || form.nodeName !== "FORM") return;
        var el, op, obj = {},
            name, type, value, node;
        for (el of form.elements) {
            name = el.name;
            if (name === "") continue;
            type = el.type;
            value = el.value;
            node = el.nodeName;
            if (/INPUT/.exec(node) && (/text|hidden|password|button|reset|submit/.exec(type) || /checkbox|radio/.exec(type) && el.checked) ||
                /TEXTAREA/.exec(node) ||
                /SELECT/.exec(node) && /select-one/.exec(node) ||
                /BUTTON/.exec(node) && /reset|submit|button/.exec(type)) {
                obj[name] = encodeURIComponent(value);
            } else if (/SELECT/.exec(node) && /select-multiple/.exec(node)) {
                for (op of el.options) {
                    if (op.selected) {
                        obj[name] = encodeURIComponent(op.value);
                    }
                }
            }
        }
        return obj;
    }

    function serializeObject(obj) {
        let keys = Object.keys(obj);
        let str = "";
        for (let key of keys) {
            str += key + "=" + obj[key] + "&";
        }
        str = str.slice(0, str.length - 1);
        return str;
    }
    // fast functions based on: https://github.com/codemix/fast.js/
    // # fast Map
    function fastMap(subject, fn, test) {
        if (subject instanceof Array || subject instanceof NodeList) { // Array map
            var length = subject.length,
                result = new Array(length),
                i;
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
        } else { // Object map
            var keys = Object.keys(subject),
                length = keys.length,
                i,
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
            return result
        }
    }

    function forEach(subject, fn, test) {
        fastMap(subject, fn, test);
        return equipArray(subject);
    }
    // # fast Reduce
    function fastReduce(subject, fn, initialValue, test) {
        if (subject instanceof Array || subject instanceof NodeList) { // Array reduce
            var length = subject.length,
                i,
                result;

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
        } else { // Object reduce
            var keys = Object.keys(subject),
                length = keys.length,
                i,
                result;
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
        if (subject instanceof Array || subject instanceof NodeList) { // Array filter
            var length = subject.length,
                result = [],
                i;
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
        } else { // Object filter
            var keys = Object.keys(subject),
                length = keys.length,
                i,
                result = {};
            if (!test) {
                for (i = 0; i < length; i++) {
                    if (fn(subject[keys[i]], keys[i], subject)) {
                        result[keys[i]] = (subject[keys[i]]);
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (test(subject[keys[i]])) break;
                    if (fn(subject[keys[i]], keys[i], subject)) {
                        result[keys[i]] = (subject[keys[i]]);
                    }
                }
            }
            return result;
        }

    }
    // faster than querySelectorAll (in most cases) #broken
    function fastQuery(el, selector) {
        return el.querySelectorAll(selector);
        return (!(selector instanceof Node || selector instanceof NodeList)) ? el.querySelectorAll(selector) : selector; //fix '[name=value]' add "," fix :hover
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
        return nodeList; //nodeList.hasOwnProperty("length")?nodeList:[nodeList];
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
        if (document.fullscreenElement ||
            document.webkitFullscreenElement || document.mozFullScreenElement) {
            exitFullscreen();
        } else {
            launchIntoFullscreen(element);
        }
    }

    // helper functions
    function on(el, str, fn, bool) {
        let noDefault = e => {
            e.preventDefault();
            return fn;
        };
        el.addEventListener(str, bool ? noDefault : fn);
        return el;
    }

    function off(el, str, fn) {
        el.removeEventListener(str, fn);
        return el;
    }
    // AJAX
    function post(url, data, success, error) {
        ajax({
            type: "POST",
            url: url,
            success: success,
            error: error,
            data: data,
        });
    }

    function get(url, success, error) {
        ajax({
            type: "GET",
            url: url,
            success: success,
            error: error,
        });
    }

    function getJSON(url, success, error) {
        get(url, e => success(JSON.parse(e)), error);
    }

    function ajax(data) {
        if (!data.success) data.success = NOOP;
        if (!data.error) data.error = NOOP;
        let req = new XMLHttpRequest();
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
            callback && callback({
                width: newImg.width,
                height: newImg.height
            })
        }
        newImg.src = imgSrc;
    }
    // equip object
    function equipObject(obj) {
        obj = equipArray(obj);
        if (!!obj.addEventListener) obj.on = (str, fn, bool) => on(obj, str, fn, bool);
        if (!!obj.removeEventListener) obj.off = (str, fn) => off(obj, str, fn);
        return obj;
    }
    // equip event
    function equipEvent(e) {
        return e;
    }
    // equip single
    function equipSingle(node) {
        node.on = (str, fn, bool) => on(node, str, fn, bool);
        node.off = (str, fn) => off(node, str, fn);
        node.find = (selector) => fastQuery(node, selector);
        return node;
    }
    // equip Array 
    function equipArray(arr) {
        arr.map = (fn, cond) => fastMap(arr, fn, cond);
        arr.forEach = (fn, cond) => forEach(arr, fn, cond);
        arr.reduce = (fn, init, cond) => fastReduce(arr, fn, init, cond);
        arr.filter = (fn, cond) => fastFilter(arr, fn, cond);
        return arr;
    }
    // equip nodeList
    function equip(nodeList) {
        nodeList = equipArray(nodeList);
        nodeList.html = str => { // experimental
            nodeList.map(el => str ? el.innerHTML = str : el.innerHTML);
            return nodeList;
        };
        nodeList.on = (str, fn, bool) => {
            fastMap(nodeList, el => {
                on(el, str, fn, bool);
            });
            return nodeList;
        };
        nodeList.off = (str, fn) => {
            fastMap(nodeList, el => {
                off(el, str, fn);
            });
        };
        nodeList.click = (fn, bool) => {
            nodeList.on("click", fn, bool);
            return nodeList;
        }
        nodeList.get = n => {
            return equipSingle(nodeList[n]);
        };
        nodeList.first = () => {
            return nodeList.get(0);
        }
        nodeList.last = () => {
            return nodeList.get(nodeList.length - 1);
        }
        nodeList.parent = () => {
            return equip(fastMap(nodeList, e => e.parentElement));
        }
        // faster replace operations - EXPERIMENTAL
        // {fn} must return an element
        nodeList.map.replace = fn => {
            var nodes = Array.from(nodeList);
            $$.map(nodes, e => {
                var k = e.cloneNode(true);
                fn(k);
                //list.push(k);
                e.parentNode.replaceChild(k, e);
            });
            $$.map(nodes, (e, i) => {
                //e.parentNode.replaceChild(list[i], e);
            });
        };
        return nodeList;
    }
    // main
    var $$ = selector => {
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
        } else if (typeof selector === "object") {
            return equipObject(selector);
        }
    };
    // ## public vars ##
    $$.mouse = {}; // keep track of mouse position
    on(document, "mousemove", e => {
        $$.mouse = {
            x: e.x,
            y: e.y,
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY
        }
    });
    $$.over = (el) => { // test if mouse is over element
        const rect = el.getBoundingClientRect();
        var x = $$.mouse.x;
        var y = $$.mouse.y;
        return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
    };
    $$.addClass = (el, className) => {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };
    $$.removeClass = (el, className) => {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };
    $$.hasClass = (el, className) => {
        if (el.classList)
            return el.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    };
    $$.toggleClass = (el, className) => {
        return $$.hasClass(el, className) ? $$.removeClass(el, className) : $$.addClass(el, className);
    };
    $$.isHover = e => { // propably useless
        return fastReduce(e.parentElement.querySelectorAll(':hover'), (acc, t) => e === t || acc, false);
    };
    $$.style = (el, pseudo) => {
        return window.getComputedStyle(el, pseudo ? pseudo : null);
    };

    $$.after = (el, str) => el.insertAdjacentHTML('afterend', str);
    $$.before = (el, str) => el.insertAdjacentHTML('beforebegin', str);
    $$.append = (el, child) => el.appendChild(child);
    $$.prepend = (el, child) => el.insertBefore(child, el.firstChild);
    $$.remove = (el) => el.parentNode.removeChild(el);
    $$.replace = (el, str) => el.outerHTML = str;
    $$.clone = (el) => el.cloneNode(true);
    $$.empty = (el) => el.innerHTML = '';
    $$.attr = (el, name, value) => value || value === "" ? el.setAttribute(name, value) : el.getAttribute(name);
    $$.css = (el, name, value) => value ? el.style[name] = value : getComputedStyle(el)[name];
    $$.html = (el, str) => str ? el.innerHTML = str : el.innerHTML;
    $$.text = (el, str) => str ? el.textContent = str : el.textContent;
    $$.next = (el) => el.nextElementSibling;
    $$.prev = (el) => el.previousElementSibling;
    $$.scroll = e => {
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        }
    }
    $$.offset = (el) => {
        /* var rect = el.getBoundingClientRect();
        return {
            top: rect.top,//+window.pageYOffset,// + document.body.scrollTop,
            left: rect.left,//+window.pageXOffset,// + document.body.scrollLeft,
            bottom: rect.bottom,//+window.pageYOffset,// + document.body.scrollTop,
            right: rect.right,//+window.pageXOffset,// + document.body.scrollLeft,
        }; */
        return el.getBoundingClientRect();
    };
    $$.parent = (e) => e.parentNode;
    $$.siblings = (e) => fastFilter(e.parentNode.children, child => child !== e);
    $$.position = (e) => {
        return {
            left: e.offsetLeft,
            top: e.offsetTop
        };
    };
    $$.find = (el, selector) => fastQuery(el, selector);
    $$.exists = (e) => {
        var el = document.querySelectorAll(e);
        return !!el.length && el.length > 0;
    };
    // DOMReady event // # integrate on top - remove here
    $$.ready = (fn) => $$(document).on("DOMContentLoaded", fn);
    $$.load = (fn) => on(window, "load", fn);
    // cookies
    $$.getCookies = getCookies;
    $$.getCookie = getCookie;
    $$.setCookie = setCookie;
    $$.existsCookie = existsCookie;
    // ajax
    $$.ajax = ajax;
    $$.get = get;
    $$.getJSON = getJSON;
    $$.post = post;
    // imageSize
    $$.getImgSize = getImgSize;
    // fullscreen
    $$.enterFullscreen = launchIntoFullscreen;
    $$.exitFullscreen = exitFullscreen;
    $$.toggleFullscreen = toggleFullscreen;
    // local/session Storage
    $$.session = (name, value) => value ? sessionStorage.setItem(name, value) : sessionStorage.getItem(name);
    $$.local = (name, value) => value ? localStorage.setItem(name, value) : localStorage.getItem(name);
    // export map-reduce
    $$.map = fastMap;
    $$.forEach = forEach;
    $$.reduce = fastReduce;
    $$.filter = fastFilter;
    // export
    window.$$ = $$;
})();
