import * as THREE from 'three'; 

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    s: { pressed: false },
    w: { pressed: false },
    l: { pressed: false },
    q: { pressed: false },
    e: { pressed: false },
    space: { pressed: false }
};

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyA': keys.a.pressed = true; break;
        case 'KeyD': keys.d.pressed = true; break;
        case 'KeyS': keys.s.pressed = true; break;
        case 'KeyW': keys.w.pressed = true; break;
        case 'KeyL': keys.l.pressed = true; break;
        case 'KeyQ': keys.q.pressed = true; break;
        case 'KeyE': keys.e.pressed = true; break;
        case 'Space': keys.space.pressed = true; break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyA': keys.a.pressed = false; break;
        case 'KeyD': keys.d.pressed = false; break;
        case 'KeyS': keys.s.pressed = false; break;
        case 'KeyW': keys.w.pressed = false; break;
        case 'KeyL': keys.l.pressed = false; break;
        case 'KeyQ': keys.q.pressed = false; break;
        case 'KeyE': keys.e.pressed = false; break;
        case 'Space': keys.space.pressed = false; break;
    }
});
 

// Function to move the spaceship based on the current state of the keys and physics parameters
export function moveSpaceship(Spaceship_obj, delta , light) {
    if (Spaceship_obj) {
        
        const maxVelocity = Spaceship_obj.MaxVelocity; // Set your desired max velocity
        const dampingFactor = 0.95; // Adjust this value for the rate of slowing down
        const thrustPower = 0.4; // Adjust this value for the rate of acceleration

        //light.position is the copy of the space position
        // light.position.copy(Spaceship_obj.position);

            if (keys.space.pressed) {
                // console.log("non realistico: ",realistic)
                if (Spaceship_obj.Fuel > 0) {
                    // console.log("Fuel: ", Spaceship_obj.Fuel);
                    
                    const forward = new THREE.Vector3(0, 0, thrustPower).applyQuaternion(Spaceship_obj.quaternion);
                    // Calculate the thrust direction and apply it
                    Spaceship_obj.velocity.add(forward);
                    
              
                    const forwardDir = forward.clone().normalize();
                    const currentVelocity = Spaceship_obj.velocity.clone();

                    const forwardComponent = forwardDir.multiplyScalar(currentVelocity.dot(forwardDir));
                    const lateralComponent = currentVelocity.sub(forwardComponent).multiplyScalar(dampingFactor);
                     // Reduce the other components of velocity
                    Spaceship_obj.velocity.copy(forwardComponent.add(lateralComponent));
                    Spaceship_obj.Fuel -= 0.25;
                    
                    // Clamp the velocity to the maximum velocity
                    if (Spaceship_obj.velocity.length() > maxVelocity) {
                        Spaceship_obj.velocity.setLength(maxVelocity);
                    }
                }
              }
        

        if (keys.l.pressed) {
            Spaceship_obj.velocity.multiplyScalar(dampingFactor);
            if (Spaceship_obj.velocity.length() < 0.03) {
                Spaceship_obj.velocity.set(0, 0, 0); // Stop completely if very slow
                
            }
        }

        // Update the spaceship's position based on its velocity and the delta time 
        Spaceship_obj.position.add(Spaceship_obj.velocity.clone().multiplyScalar(delta));
        
        const omega = Spaceship_obj.velocity.length()/(Spaceship_obj.side_len*3); //angular velocity
        const rot_ang = omega*delta + 0.03; //rotation angle
        if (keys.w.pressed) {
            Spaceship_obj.rotateX(-rot_ang) // Function rotateX rotates the object around the axis of the object in the world space
        }
        if (keys.s.pressed) {
            Spaceship_obj.rotateX(rot_ang);
        }
        if (keys.a.pressed) {
            Spaceship_obj.rotateY(rot_ang);
        }
        if (keys.d.pressed) {
            Spaceship_obj.rotateY(-rot_ang);
        }
        if (keys.q.pressed) {
            Spaceship_obj.rotateZ(rot_ang);
        }
        if (keys.e.pressed) {
            Spaceship_obj.rotateZ(-rot_ang);
        }
    }
}

