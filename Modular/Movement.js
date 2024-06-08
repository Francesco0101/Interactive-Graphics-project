import * as THREE from 'three'; 

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    s: { pressed: false },
    w: { pressed: false },
    space: { pressed: false }
};

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyA': keys.a.pressed = true; break;
        case 'KeyD': keys.d.pressed = true; break;
        case 'KeyS': keys.s.pressed = true; break;
        case 'KeyW': keys.w.pressed = true; break;
        case 'Space': keys.space.pressed = true; break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyA': keys.a.pressed = false; break;
        case 'KeyD': keys.d.pressed = false; break;
        case 'KeyS': keys.s.pressed = false; break;
        case 'KeyW': keys.w.pressed = false; break;
        case 'Space': keys.space.pressed = false; break;
    }
});
 
export function moveSpaceship(Spaceship_obj, delta) {
    if (Spaceship_obj) {
        
        if (keys.space.pressed) {
            const forward = new THREE.Vector3(0, 0, 0.1).applyQuaternion(Spaceship_obj.quaternion);
            Spaceship_obj.position.add(forward);
        }
        if (keys.w.pressed) {
            Spaceship_obj.rotation.x -= 0.1;
        }
        if (keys.s.pressed) {
            Spaceship_obj.rotation.x += 0.1;
        }
        if (keys.a.pressed) {
            Spaceship_obj.rotation.y += 0.05;
        }
        if (keys.d.pressed) {
            Spaceship_obj.rotation.y -= 0.05;
        }
    }
}

