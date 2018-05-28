// https://jsfiddle.net/c7x43t/n69s4scy/3/
// https://stackoverflow.com/questions/24393979/node-js-image-proxy?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
// # Tools
// https://www.npmjs.com/package/compress-images
// http://aheckmann.github.io/gm/

var http = require('http'),
    url = require('url');

exports.show = function (req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var options = {
        host: "api.com",
        path: "/dgtf/20080303201247771409000000.jpg"
    };

    var callback = function(response) {
        if (response.statusCode === 200) {
            res.writeHead(200, {
                'Content-Type': response.headers['content-type']
            });
            response.pipe(res);
        } else {
            res.writeHead(response.statusCode);
            res.end();
        }
    };

    http.request(options, callback).end();
};
/*
DESCRIPTION:
image resources get routet trough this proxy, which serves compressed images if they exist
*/
