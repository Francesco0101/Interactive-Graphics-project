import { createScene, createRenderer, createLights, CreateRingedPlanet , CreateSystem } from './SceneSetup.js';
import { createCameras, updateFollowCamera, update3PCamera } from './Camera.js';
import { createControls } from './Controls.js';
import { loadModels2 ,loadBackground, loadFortnite, loadModels1} from './Loaders.js';
import { setupGUI } from './GUI.js';
import { moveSpaceship } from './Movement.js';
import { GUI } from 'dat.gui';
import * as THREE from 'three';
// Create the scene
const scene = createScene();

// Create the renderer
const renderer = createRenderer();

// Create the lights
createLights(scene);

// Create the cameras
const { camera, followCamera, TPcamera, activeCamera } = createCameras(scene);

// Create controls
const controls = createControls(camera, renderer.domElement);

// Load models
let Spaceship_obj;
loadModels1(scene).then(models => {
    Spaceship_obj = models.Spaceship_obj;
});
loadBackground(scene,renderer)

let robot_obj;
loadFortnite(scene).then(models => {
    robot_obj = models.robot_obj;
});



// Create GUI
setupGUI(camera, activeCamera, followCamera, TPcamera, scene);
console.log("camera: ",camera)
console.log("activeCamera: ",activeCamera.value)
console.log("followCamera: ",followCamera)
console.log("TPcamera: ",TPcamera)
console.log("scene: ",scene)
console.log("controls: ",controls)
//make a gui for the spaceship, where i can change the velocity with a slidebar, a button to reset position and a button to activate the bounding box. a button to refill fuel too after the spaceship object has been loaded


let Planets = [];
let Rings = [];
Planets= CreateSystem(scene);
console.log(Planets)
// Create the clock
const clock = new THREE.Clock();
// Animation loop 
// Get UI elements
let maxVelocity = 10;
const posXElem = document.getElementById('pos-x');
const posYElem = document.getElementById('pos-y');
const posZElem = document.getElementById('pos-z');
const velXElem = document.getElementById('vel-x');
const velYElem = document.getElementById('vel-y');
const velZElem = document.getElementById('vel-z');
const speedBarElem = document.getElementById('speed-bar');
const speedValueElem = document.getElementById('speed-value');

// Function to check if a point is inside a sphere
function isPointInsideSphere(point, sphereCenter, sphereRadius) {
    const distance = point.distanceTo(sphereCenter);
    return distance < sphereRadius;
}

// Function to check for collisions between a bounding box and a sphere
function checkBoundingBoxSphereCollision(boundingBox, sphereCenter, sphereRadius) {
    const points = [
        new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
        new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),
        new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),
        new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z),
        new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z),
        new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),
        new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),
        new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z)
    ];

    for (const point of points) {
        if (isPointInsideSphere(point, sphereCenter, sphereRadius)) {
            console.log("collision detecteddddddddddddddddddddddd")
            Spaceship_obj.position.set(180, 20, 0);
            Spaceship_obj.velocity.set(0, 0, 0);
            Spaceship_obj.acceleration.set(0, 0, 0);
        }
    }

    return false;
}



function animate() {
    requestAnimationFrame(animate);
    // Update bounding box for the spaceship

    let delta = clock.getDelta(); // Calcola il delta time
    if (activeCamera.value === followCamera) {
        updateFollowCamera(Spaceship_obj, followCamera);
    }
    if (activeCamera.value === TPcamera) {
        update3PCamera(Spaceship_obj, TPcamera);
    }

    if (Spaceship_obj) {
        // Update bounding box for the spaceship
        Spaceship_obj.boundingBox.setFromObject(Spaceship_obj);

        // Update bounding box helper if it exists
        if (Spaceship_obj.boxHelper) {
            Spaceship_obj.boxHelper.update();
        }

        // Check for collisions

        // Update planets' rotation and bounding spheres
        Planets.forEach((planet) => {
            const sphereCenter = new THREE.Vector3().setFromMatrixPosition(planet.matrixWorld);
            // console.log("radius",planet.radius)
            if (checkBoundingBoxSphereCollision(Spaceship_obj.boundingBox, sphereCenter, planet.radius)) {
                console.log('Collision detected!');
                
            }
            planet.rotation.y += 0.00; // Adjust rotation speed if necessary

            // Update the bounding sphere's position
            if (planet.boundingSphere) {
                planet.boundingSphere.center.copy(planet.position);
            }
        });

    const realistic = false;
    maxVelocity = Spaceship_obj.MaxVelocity;
    posXElem.textContent = Spaceship_obj.position.x.toFixed(2);
    posYElem.textContent = Spaceship_obj.position.y.toFixed(2);
    posZElem.textContent = Spaceship_obj.position.z.toFixed(2);
    moveSpaceship(Spaceship_obj,delta,realistic);
    velXElem.textContent = Spaceship_obj.velocity.x.toFixed(2);
    velYElem.textContent = Spaceship_obj.velocity.y.toFixed(2);
    velZElem.textContent = Spaceship_obj.velocity.z.toFixed(2);
    const speed = Spaceship_obj.velocity.length();
    const speedPercentage = Math.min(speed / maxVelocity, 1) * 100;
    speedBarElem.style.width = `${speedPercentage}%`;
    speedValueElem.textContent = speed.toFixed(2);
    

}

    renderer.render(scene, activeCamera.value);
}

animate();
