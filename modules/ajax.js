// https://caniuse.com/#search=promise
var request = new XMLHttpRequest();
request.open('GET', '/my/url', true);

request.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      var data = JSON.parse(this.responseText);
    } else {
      // Error :(
    }
  }
};

request.send();
request = null;

$$.request=function(obj){
	var request = new XMLHttpRequest();
	request.open(obj.type, obj.url, true);
	request.onreadystatechange = function() {
	  if (this.readyState === 4) {
		if (this.status >= 200 && this.status < 400) {
		  obj.success(this.responseText);
		} else {
		  obj.hasOwnProperty("error")?obj.error():null;
		}
	  }
	};
	if(obj.header) {
		request.setRequestHeader('Content-Type',obj.header||'application/x-www-form-urlencoded; charset=UTF-8');
		request.send(data);
	}else{
		request.send();
	}
	request = null;
}
$$.getJSON=function(url,success){
	$$.request({
		type:"GET",
		url:url,
		success:resp=>success(JSON.parse(resp)),
	})
}
$$.get	
$$.post

