function getQueryParameters() {
    var obj = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        obj[pair[0]] = pair[1];
    }
    return obj;
}
