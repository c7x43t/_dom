// FROM: https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d
// GOAL: https://www.npmjs.com/package/pure-swipe-js
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
const gestureZone = document;
gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
let detail={left:false,right:false,top:false,bottom:false,tap:false};    
if (Math.abs(x) > treshold || Math.abs(y) > treshold) {		
	
        if (yx <= limit) {
            if (x < 0) {
                detail.left=true;
            } else {
                detail.right=true;
            }
        }
        if (xy <= limit) {
            if (y < 0) {
                detail.top=true;
            } else {
                detail.bottom=true;
            }
        }
    } else {
        detail.tap=true;
    }
	document.dispatchEvent(new CustomEvent('swipe', { bubbles: true, detail ,a:3}));
}
