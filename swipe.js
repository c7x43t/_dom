let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
const gestureZone = document;//.getElementById('modalContent');
gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);
function scalarProduct(a,b){
	return a.reduce((acc,e,i)=>acc+e*b[i],0);
}
function vecLength(v){
	return Math.sqrt(v.reduce((acc,e)=>acc+e**2,0))
}
function vecAngle(a,b){
	return scalarProduct(a,b)/(vecLength(a)*vecLength(b));
}
function handleGesture() {	
	vec=[touchendX-touchstartX,touchendY-touchstartY];
	var angle=[vecAngle(vec,[1,0]),vecAngle(vec,[0,1])];
	console.log(angle);	
    if (angle[0]<=-0.5) {
        console.log('Swiped left');
    }else if (angle[0]>=0.5) {
        console.log('Swiped right');
    }
    
    if (angle[1]<=-0.5) {
        console.log('Swiped up');
    }else if (angle[1]>=0.5) {
       console.log('Swiped down');
    }
    if (angle[0]===NaN&&angle[1]===NaN) {
       console.log('Tap');
    }
}
