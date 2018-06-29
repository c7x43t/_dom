var interval=setInterval(e=>window.requestAnimationFrame(callback),0);
setTimeout(e=>clearInterval(interval),1000)
var currentTime=0;
function callback(timer){
	if(timer>currentTime){
		currentTime=timer;
		run();
	}
}
var i=0;
var run=()=>i++;
