let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const gestureZone = document.getElementById('modalContent');

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
	handleGesture(event);
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function handleGesture() {
    if (touchendX < touchstartX) {
        console.log('Swiped left');
    }
    
    if (touchendX > touchstartX) {
        console.log('Swiped right');
    }
    
    if (touchendY < touchstartY) {
        console.log('Swiped up');
    }
    
    if (touchendY > touchstartY) {
       console.log('Swiped down');
    }
    
    if (touchendY === touchstartY) {
       console.log('Tap');
    }
}
