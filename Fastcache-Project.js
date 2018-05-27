// caches.put requires a Response as parameter which can be constructed from:
// Blob, BufferSource, FormData, ReadableStream, URLSearchParams, USVString
// a Blob is essentially a String concatenated from its initialization parameters
var html = `<html></html>`;
// MIME type
var type = {
    type: 'text/html'
};
// Returns a newly created Blob object whose content consists of the concatenation of the array of values given in parameter.
var blob = new Blob([html], type);
// init={status,statusText,headers}
var status = 200;
var init = {
    "status": status
};
var response = new Response(blob, init);
// consume response:
// response.text().then(console.log);
// clone response:
// var responseClone = response.clone();

var CACHE_1
var path = "/";
// set cache
window.caches.open(CACHE_1)
    .then(cache => cache.put(path, response))
// explore cache
window.caches.open(CACHE_1)
    .then(cache => cache.keys()
        .then(console.log));
//get cache
window.caches.open(CACHE_1)
    .then(cache => {
        cache.match(path)
            .then(response => {});
    })



// fetch https://stackoverflow.com/questions/29246444/fetch-how-do-you-make-a-non-cached-request
var url = 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch';
fetch(url)
    .then(function(response) {
        return response.text();
    })
    .then(function(myJson) {
        console.log(myJson);
    });

// Web Worker (easier to debug than Service Worker
// load script from string (no external js file)
var script = `
function replyHandler(event) {
    console.log(event.data); // this comes from the ServiceWorker
}
// messaging a service worker
self.addEventListener('message', function handler(event) {
    //event.ports[0].postMessage(data); // handle this using the replyHandler shown earlier
	console.log(event);
});
`;
var blob = new Blob([script], {
    type: 'text/javascript'
});
// new Worker(url)
document.worker = new Worker(window.URL.createObjectURL(blob));

// message a worker
worker.postMessage(data);
// handle message on worker side: data:={command,payload|key}
self.addEventListener('message', function handler(event) {
    console.log(event.data);
});
// recieving messages from a service worker
var messageChannel = new MessageChannel();
messageChannel.port1.addEventListener('message', replyHandler);
worker.postMessage(data, [messageChannel.port2]);

function replyHandler(event) {
    console.log(event.data); // this comes from the ServiceWorker
}
// messaging a service worker
self.addEventListener('message', function handler(event) {
    event.ports[0].postMessage(data); // handle this using the replyHandler shown earlier
});
// #################
// polish the above | web worker:
function createWorker(workerFunc) {
    if (! (workerFunc instanceof Function)) {
        throw new Error('Argument must be function');
    }
    const src = `(${workerFunc})();`;
    const blob = new Blob([src], {type: 'application/javascript'});
    const url = URL.createObjectURL(blob);
    return new Worker(url);    
}
// message the worker:
var data={command:"fetch",key:"https://google.de/"};
worker.postMessage(data);
// inside the worker | handle messages:
self.addEventListener('message', function handler(event) {
    //event.ports[0].postMessage(data); // handle this using the replyHandler shown earlier
	console.log(event);
}
