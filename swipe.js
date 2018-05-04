// FROM: https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d
// GOAL: https://www.npmjs.com/package/pure-swipe-js
const limit = Math.cos(Math.PI * (3 / 8));
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.floor(0.01 * (pageWidth));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
const gestureZone = document; //.getElementById('modalContent');

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function scalarProduct(a, b) {
    return a.reduce((acc, e, i) => acc + e * b[i], 0);
}

function vecLength(v) {
    return Math.sqrt(v.reduce((acc, e) => acc + e ** 2, 0))
}

function vecAngle(a, b) {
    return scalarProduct(a, b) / (vecLength(a) * vecLength(b));
}

function handleGesture() {
    const vec = [touchendX - touchstartX, touchendY - touchstartY];
    const angle = [vecAngle(vec, [1, 0]), vecAngle(vec, [0, 1])];
    if (!(isNaN(angle[0]) && isNaN(angle[1]) || Math.abs(vec[0]) < treshold && Math.abs(vec[1]) < treshold)) {
        if (angle[0] <= -limit) {
            console.log('Swiped left');
        } else if (angle[0] >= limit) {
            console.log('Swiped right');
        }

        if (angle[1] <= -limit) {
            console.log('Swiped up');
        } else if (angle[1] >= limit) {
            console.log('Swiped down');
        }
    } else {
        console.log('Tap');
    }
}
