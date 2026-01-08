const $card = document.querySelector(".card");

const cardUpdate = (e) => {
    
    const position = pointerPositionRelativeToElement( $card, e );
    const [px,py] = position.pixels;
    const [perx, pery] = position.percent;
    const [dx,dy] = distanceFromCenter( $card, px, py );
    const edge = closenessToEdge( $card, px, py );
    const angle = angleFromPointerEvent( $card, dx, dy );

    $card.style.setProperty('--pointer-x', `${round(perx)}%`);
    $card.style.setProperty('--pointer-y', `${round(pery)}%`);
    $card.style.setProperty('--pointer-°', `${round(angle)}deg`);
    $card.style.setProperty('--pointer-d', `${round(edge * 100)}`);
    
    $card.classList.remove('animating');
    
};

$card.addEventListener("pointermove", cardUpdate);






const centerOfElement = ($el) => {
    const { left, top, width, height } = $el.getBoundingClientRect();
    return [ width/2, height/2 ];
}

const pointerPositionRelativeToElement = ($el, e) => {
    const pos = [e.clientX, e.clientY];
    const { left, top, width, height } = $el.getBoundingClientRect();
    const x = pos[0] - left;
    const y = pos[1] - top;
    const px = clamp((100 / width) * x);
    const py = clamp((100 / height) * y);
    return { pixels: [x,y], percent: [px,py] }
}

const angleFromPointerEvent = ($el, dx, dy ) => {
    // in degrees
    let angleRadians = 0;
    let angleDegrees = 0;
    if ( dx !== 0 || dy !== 0 ) {
        angleRadians = Math.atan2(dy, dx);
        angleDegrees = angleRadians * (180 / Math.PI) + 90;
        if (angleDegrees < 0) {
            angleDegrees += 360;
        }
    }
    return angleDegrees;
}

const distanceFromCenter = ( $card, x, y ) => {
    // in pixels
    const [cx,cy] = centerOfElement( $card );
    return [ x - cx, y - cy ];
}

const closenessToEdge = ( $card, x, y ) => {
    // in fraction (0,1)
    const [cx,cy] = centerOfElement( $card );
    const [dx,dy] = distanceFromCenter( $card, x, y );
    let k_x = Infinity;
    let k_y = Infinity;
    if (dx !== 0) {
        k_x = cx / Math.abs(dx);
    }    
    if (dy !== 0) {
        k_y = cy / Math.abs(dy);
    }
    return clamp((1 / Math.min(k_x, k_y)), 0, 1);
}

const round = (value, precision = 3) => parseFloat(value.toFixed(precision));

const clamp = (value, min = 0, max = 100) =>
    Math.min(Math.max(value, min), max);





























/** code for the intro animation, not related to teh interaction */

const playAnimation = () => {

    const angleStart = 110;
    const angleEnd = 465;

    $card.style.setProperty('--pointer-°', `${angleStart}deg`);
    $card.classList.add('animating');

    animateNumber({
        ease: easeOutCubic,
        duration: 500,
        onUpdate: (v) => {
            $card.style.setProperty('--pointer-d', v);
        }
    });

    animateNumber({
        ease: easeInCubic,
        delay: 0,
        duration: 1500,
        endValue: 50,
        onUpdate: (v) => {
            const d = (angleEnd - angleStart) * (v / 100) + angleStart;
            $card.style.setProperty('--pointer-°', `${d}deg`);
        }
    }); 

    animateNumber({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        startValue: 50,
        endValue: 100,
        onUpdate: (v) => {
            const d = (angleEnd - angleStart) * (v / 100) + angleStart;
            $card.style.setProperty('--pointer-°', `${d}deg`);
        }
    });

    animateNumber({
        ease: easeInCubic,
        duration: 1500,
        delay: 2500,
        startValue: 100,
        endValue: 0,
        onUpdate: (v) => {
            $card.style.setProperty('--pointer-d', v);
        },
        onEnd: () => {
            $card.classList.remove('animating');
        }
    });
        
}

setTimeout(() => {
    playAnimation();
}, 500);


function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x) {
    return x * x * x;
} 

function animateNumber(options) {
    const {
        startValue = 0,
        endValue = 100,
        duration = 1000,
        delay = 0,
        onUpdate = () => {},
        ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        onStart = () => {},
        onEnd = () => {},
    } = options;

    const startTime = performance.now() + delay;

    function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1); // Normalize to [0, 1]
        const easedValue = startValue + (endValue - startValue) * ease(t); // Apply easing

        onUpdate(easedValue);

        if (t < 1) {
            requestAnimationFrame(update); // Continue the animation
        } else if (t >= 1) {
            onEnd();
        }
    }
    
    setTimeout(() => {
        onStart();
        requestAnimationFrame(update); // Start the animation after the delay
    }, delay);
}



/* theme switching */

const $app = document.querySelector('#app');
const $moon = document.querySelector(".moon");
const $sun = document.querySelector(".sun");

$moon.addEventListener('click', () => {
    document.body.classList.remove('light');
    $app.classList.remove('light');
})

$sun.addEventListener('click', () => {
    document.body.classList.add('light');
    $app.classList.add('light');
})