const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const request = require('request');
const cert = {
  cert: fs.readFileSync(path.join(__dirname, './localhost-cert.pem')),
  key: fs.readFileSync(path.join(__dirname, './localhost-privkey.pem'))
}

function get(url,success,error){
  request({
    uri: url,
    method: 'GET',
    maxRedirects:3
  }, function(err, response, body) {
    console.log(response&&response.statusCode);
    if (!err) {
      success(response);  
    } else {
      error(err);
    }
  });
}
async function asyncGet(url){ //returns
  function promiseGet(resolve,reject){
    get(url,resolve,reject);
  }
  var response={};
  try{
    response=await new Promise(promiseGet);
  }catch(err){
    response.error=err
  }
  return response;
}

var port=8000;
var proxy = http.createServer(function (req, res) {
  var url='https://www.derlifestyleshop.de'+req.url;
    function success(response){
      var body=processIMG(response);
      return body; 
    }
    function error(err){
      res.write(JSON.stringify(err));
      res.end();
    }
    (async()=>{
      var response=await asyncGet(url);
      res.writeHead(200,{'Content-Type': "text/html; charset=utf-8"});
      if(!(error in response)){ // on success
        var body=response.body;
        body=processIMG(body);
        res.write(body);
      }else{ // on error
        res.write(JSON.stringify(response.error));
      }
      res.end();
    })();
});
proxy.listen(port);

var cache={};
function primitiveCache(url){
  var TTL=60; // sec
  if(url in cache){
    if(cache[url].expires<Date.now()){
      cacheRefresh(url,TTL);
      return cacheRefresh(url,TTL);
    }
  }else{
    cacheRefresh(url,TTL);
  }
  console.log({cache:cache});
  return ""; // for debug only
}

async function cacheRefresh(url,TTL){
  var response=await asyncGet(url);
  if(!("error" in response)){ // on success
    cache[url]={
      body:response.body,
      expires:Date.now()+TTL*1e3
    }
  }else{
    console.error({cacheRefresh:"no response",url:url});
  }
  return response;
}

var transparentGIF="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

function processIMG(body){
  var regex=/(<img .*?)src="(.*?)"(.*?>)/ig;
  body=body.replace(regex,`$1src="${transparentGIF}" src-lazy="$2"$3`)
  return body;
}
