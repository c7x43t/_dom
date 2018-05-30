const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const request = require('request');
const cert = {
  cert: fs.readFileSync(path.join(__dirname, './localhost-cert.pem')),
  key: fs.readFileSync(path.join(__dirname, './localhost-privkey.pem'))
}
var options={
	staleOnError:true,
	serveStale:true,
	debug:true,
}
var storeFetch={};

async function get(url,success,error){
  request({
    uri: url,
    method: 'GET',
    maxRedirects:3
  }, function(err, response, body) {
    if(options.debug) console.log(response&&response.statusCode);
    if (!err) {
      success(response);  
    } else {
      error(err);
    }
  });
}
// user function to handle response
async function handleResponse(res,response){
	res.writeHead(200,{'Content-Type': "text/html; charset=utf-8"});
	var body=response.body;
	body=processIMG(body);
	res.write(body);
	res.end();
}
var port=8000;
var proxy = http.createServer(function (req, res) {
	var url='https://www.derlifestyleshop.de'+req.url;
	if(!storeFetch[url]){ // on new unique request url
		storeFetch[url]={
			pending:[],
			status:false,
			stale:undefined
		};
	};
	//serve stale if enabled
	if(options.serveStale&&storeFetch[url].stale){ 
		res.write(storeFetch[url].stale.body);
		res.end();
	}else{
		// enter queue for fresh response
		storeFetch[url].pending.push(res);
	}
	// if no other request to this url is beeing made
	if(!storeFetch[url].status){ 
		// block parallel requests
		storeFetch[url].status=true;
		// fetch url
		get(url,success,error);
		async function success(response){
			storeFetch[url].status=false;
			storeFetch[url].stale=response;
			//storeFetch[url].pending.map(res=>handleResponse(res,response));
			while(storeFetch[url].pending.length>0){
				handleResponse(storeFetch[url].pending.shift(),response);
			}
		}
		async function error(err){
			storeFetch[url].status=false;
			storeFetch[url].pending.map((res)=>{
				if(options.staleOnError&&storeFetch[url].stale){ // serve stale on error if enabled
					res.write(storeFetch[url].stale.body);
				}else{
					res.write(JSON.stringify(response.error));
				}
				res.end();
			});
		}
	}
});
proxy.listen(port);

var transparentGIF="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

function processIMG(body){
  var regex=/(<img .*?)src="(.*?)"(.*?>)/ig;
  body=body.replace(regex,`$1src="${transparentGIF}" src-lazy="$2"$3`)
  return body;
}
