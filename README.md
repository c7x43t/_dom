# API

CSS Selector:
$$(selector)
returns: NodeList with following methods:
- map()
- reduce()
- filter()
- on()

Events:
- $$.on(eventName, callback);
- $$.off(eventName);

Ajax:
- $$.ajax({type,url,success,error,data});
- $$.get(url,success,error);
- $$.getJSON(url,success,error);
- $$.post(url,data,success,error);

Cookies:
- $$.getCookies(); // return cookies as object
- $$.getCookie(name);
- $$.setCookie(name,value);
- $$.existsCookie(name);

