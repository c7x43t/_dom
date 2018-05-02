(() => {
    // ## private vars ##
    const NOOP = () => {};
    const regexPreFilter = /[.#]?-?[_a-zA-Z]+?[_a-zA-Z0-9-]*/;
    const regexCommaDelimiter=/ *, */;
    const regexSpaceDelimiter=/ +/;
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
            return n
        }
        n = {};
        for (let i in o)
            if (!!o[i]) n[i] = deepCopy(o[i]); // fast hasProperty test
        return n
    }
    // COOKIES
    function getCookies(){
        const cookies={};
        let cookie;
    document.cookie.split(/; */).map(e=>{
            cookie=e.split("=");
        cookies[cookie[0]]=cookie[1];
        });
        return cookies;
    }
    function getCookie(name){
        return getCookies()[name];
    }
    function setCookie(name,value){
        document.cookie=name+"="+value;
    }
    function existsCookie(name){
        return !!getCookie(name);
    }
    // FORM SERIALIZATION
    function serializeToObject(form){ // takes string, Node or NodeList (first Element)
        form = form instanceof Node ? form : form instanceof NodeList ? form[0] : $$(form)[0];
        if (!form || form.nodeName !== "FORM") return;
        var el, op, obj = {}, name, type, value, node;
        for (el of form.elements) {
            name=el.name;
            if (name === "") continue;
            type=el.type;
            value=el.value;
            node=el.nodeName;
            if(/INPUT/.exec(node) && (/text|hidden|password|button|reset|submit/.exec(type) || /checkbox|radio/.exec(type)&&el.checked) || 
            /TEXTAREA/.exec(node) || 
            /SELECT/.exec(node) && /select-one/.exec(node) || 
            /BUTTON/.exec(node) && /reset|submit|button/.exec(type)){
                obj[name] = encodeURIComponent(value);
            }else if(/SELECT/.exec(node) && /select-multiple/.exec(node)){
                for (op of el.options) {
                    if (op.selected) {
                        obj[name] = encodeURIComponent(op.value);
                    }
                }
            }
        }
        return obj;
    }
    function serializeObject(obj){
        let keys=Object.keys(obj);
        let str="";
        for(let key of keys){
            str+=key+"="+obj[key]+"&";
        }
        str=str.slice(0,str.length-1);
        return str;
    }
    // ## private functions ##
    // fast functions based on: https://github.com/codemix/fast.js/
    // fast Map
    function fastMap(subject, fn, test) {
        const length = subject.length;
        let result = new Array(length),
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
        return result;
    }
    // fast Reduce
    function fastReduce(subject, fn, initialValue, test) {
        const length = subject.length;
        let i, result;

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
        return result;
    }
    // fast Filter
    function fastFilter(subject, fn, test) {
        const length = subject.length;
        let result = [],
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
        return result;
    }
    // faster than querySelectorAll (in most cases)
    function fastQuery(el, selector) {
        const nodeList=[];
        let nodes;
        selector
        .split(regexCommaDelimiter)
        .map(e=>{
            sel=e.split(regexSpaceDelimiter);
            sel.map(s=>{
                if(regexPreFilter.exec(s)&&s!==""){
                    if (s[0] === ".") {
                        nodes = el.getElementsByClassName(s.replace('.', ''));
                    } else if (s[0] === "#") {
                        nodes = el.getElementById(s.replace('#', ''));
                        nodes = nodes !== null ? [nodes] : document.createDocumentFragment().childNodes;
                    } else {
                        nodes = el.getElementsByTagName(s);
                    }
                }else{
                    nodes=el.querySelectorAll(s);
                }
                fastMap(nodes,e=>nodeList.push(e));
            });
        });
        return nodeList; //nodeList.hasOwnProperty("length")?nodeList:[nodeList];
    }
    // helper functions
    function on(el, str, fn, bool) {
        let isDefault = e => fn(el, e);
        let noDefault = e => {
            e.preventDefault();
            return fn(el, e);
        };
        el.addEventListener(str, bool ? noDefault : isDefault);
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

    function getJSON(url,success,error){
        get(url,e=>success(JSON.parse(e)),error);
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
                req=null;
            }
        };
        req.onerror = data.error;
        data.type === "POST" ? req.send(data.data) : req.send();
    }
    // equip single
    function equipSingle(node) {
        node.on = (str, fn, bool) => on(node, str, fn, bool);
        node.off = (str, fn) => off(node, str, fn);
        node.find = (selector) => fastQuery(node, selector);
        return node;
    }
    // equip nodeList
    function equip(nodeList) {
        nodeList.map = (fn, cond) => fastMap(nodeList, fn, cond);
        nodeList.reduce = (fn, init, cond) => fastReduce(nodeList, fn, init, cond);
        nodeList.filter = (fn, cond) => fastFilter(nodeList, fn, cond);
        nodeList.html = str => {
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
        nodeList.get = n => {
            return equipSingle(nodeList[n]);
        };
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
        if(typeof selector === "string" ){
            return equip(fastQuery(document, selector));
        }else if(selector instanceof NodeList){
            return equip(selector)
        }else if(selector instanceof Node){
            return equipSingle(selector);
        }
    };
    // ## public vars ##
    $$.addClass = (el, className) => {
        if (el.classList) el.classList.add(className);
        else el.className += ' ' + className;
    };
    $$.removeClass = (el, className) => {
        if (el.classList) el.classList.remove(className);
        else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };
    $$.hasClass = (el, className) => {
        if (el.classList) return el.classList.contains(className);
        else return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    };
    $$.toggleClass = (el, className) => {
        $$.hasClass(el, className) ? $$.removeClass(el, className) : $$.addClass(el, className);
    };
    $$.isHover = e => { // propably useless
        return (e.parentElement.querySelector(':hover') === e);
    };
    $$.after = (el, str)=>el.insertAdjacentHTML('afterend', str);
    $$.before = (el, str)=>el.insertAdjacentHTML('beforebegin', str);
    $$.append = (el, child)=>el.appendChild(child);
    $$.prepend = (el, child)=>el.insertBefore(child, el.firstChild);
    $$.remove = (el)=>el.parentNode.removeChild(el);
    $$.replace = (el, str)=>el.outerHTML=str;
    $$.clone = (el)=>el.cloneNode(true);
    $$.empty = (el)=>el.innerHTML='';
    $$.attr = (el, name, value)=>value?el.setAttribute(name,value):el.getAttribute(name);
    $$.css = (el, name, value)=>value?el.style[name]=value:getComputedStyle(el)[name];
    $$.html = (el, str)=>str?el.innerHTML=str:el.innerHTML;
    $$.text = (el,str)=>str?el.textContent=str:el.textContent; 
    $$.next = (el)=>el.nextElementSibling;
    $$.prev = (el)=>el.previousElementSibling;
    $$.offset = (el)=>{
        var rect = el.getBoundingClientRect();
        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft,
            bottom: rect.bottom + document.body.scrollTop,
            right: rect.right + document.body.scrollLeft,
        }
    };
    $$.parent=()=>e.parentNode;
    $$.siblings=()=>fastFilter(e.parentNode.children,child=>child !== e);
    $$.position=()=>{return{left: e.offsetLeft, top: e.offsetTop}};
    $$.style = (el, pseudo) => {
        return window.getComputedStyle(el, pseudo ? pseudo : null);
    };
    $$.find = (el, selector) => fastQuery(el, selector);
    $$.exists = (e) => fastQuery(document, e).hasOwnProperty("length");
    // DOMReady event
    $$.DOMReady = (fn) => $$(document).on("DOMContentLoaded",fn);
    // cookies
    $$.getCookies=getCookies;
    $$.getCookie=getCookie;
    $$.setCookie=setCookie;
    $$.existsCookie=existsCookie;
    // ajax
    $$.ajax = ajax;
    $$.get = get;
    $$.getJSON = getJSON;
    $$.post = post;
    // map-reduce
    $$.map = fastMap;
    $$.reduce = fastReduce;
    $$.filter = fastFilter;
    $$.serialize = e=>serializeObject(serializeToObject(e));
    // export
    window.$$ = $$;
})();
