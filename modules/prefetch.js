(function(scope) {
    var options = {
        delay: 250
    };
    var prefetchID = "prefetch" + Date.now();
    var store = {
        prefetched: {},
        loading: {}
    };
    scope[prefetchID] = {
        fireEvent: function() {
            store.loaded = true;
            handlePageload();
            if (store.static) {
                store.prefetched[store.url] = true;
            }
            var e = document.getElementById(prefetchID);
            e.parentElement.removeChild(e);
        }
    };
    var links = document.querySelectorAll("a");
    Array.apply(null, links).map(registerLinkListeners);

    function findNestedLink(element) {
        try {
            return element.tagName === "A" ? element : findNestedLink(element.parentElement);
        } catch (e) {}
    }

    function linkMouseDownListener(event) {
        if (event.button === 0) {
            //console.log(event);
            if (store.prefetched[store.url]) {
                store.loaded = true;
            } else if (!store.loading[store.url]) {
                prefetchUrl(store.url);
            }
        }
    }

    function prefetchUrl(url) {
        store.loading[url] = true;
        let node = document.createElement('div');
        node.innerHTML = `<link id="${prefetchID}" rel=prefetch href="${url}" onload="${prefetchID}.fireEvent()" />`;
        document.querySelector('head').appendChild(node.childNodes[0]);
    }

    function linkMouseClickListener(event) {
        event.preventDefault();
    }

    function linkMouseEnterListener(event) {
        store.target = findNestedLink(event.target);
        store.url = store.target.href;
        store.loaded = false;
        store.static = true;
        store.mouse = false;
        if (options.delay > 0) {
            setTimeout(function() {
                if (store.prefetched[store.url]) {
                    store.loaded = true;
                } else if (!store.loading[store.url] && store.static) {
                    prefetchUrl(store.url);
                }
            }, options.delay);
        }
    }

    function linkMouseOutListener(event) {
        store.static = false;
    }

    function linkMouseUpListener(event) {
        if (event.button === 0) {
            store.mouse = true;
            handlePageload();
        }
    }

    function registerLinkListeners(element) {
        [
            ["mouseenter", linkMouseEnterListener],
            ["mouseout", linkMouseOutListener],
            ["mousedown", linkMouseDownListener],
            ["mouseup", linkMouseUpListener],
            ["click", linkMouseClickListener]
        ]
        .map(function(e) {
            element.addEventListener(e[0], e[1]);
        });
    }

    function handlePageload() {
        //console.log({context:"handlePageload",store:store});
        if ((store.loaded || store.prefetched[store.url]) && store.static && store.mouse) {
            navigateToTarget();
        }
    }

    function navigateToTarget() {
        scope.location.href = store.url;
    }
}(window));
