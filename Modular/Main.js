import { createScene, createRenderer, createLights, CreateRingedPlanet , CreateSystem } from './SceneSetup.js';
import { createCameras, updateFollowCamera, update3PCamera } from './Camera.js';
import { createControls } from './Controls.js';
import { loadModels ,loadBackground} from './Loaders.js';
import { setupGUI } from './GUI.js';
import { moveSpaceship } from './Movement.js';

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
loadModels(scene).then(models => {
    Spaceship_obj = models.Spaceship_obj;
});
loadBackground(scene,renderer)


// Create GUI
setupGUI(camera, activeCamera, followCamera, TPcamera, controls, scene);
console.log("camera: ",camera)
console.log("activeCamera: ",activeCamera.value)
console.log("followCamera: ",followCamera)
console.log("TPcamera: ",TPcamera)
console.log("scene: ",scene)
console.log("controls: ",controls)
// Create planet

// CreateRingedPlanet(scene, 50 , 5);
let objects = [];
objects= CreateSystem(scene);
console.log(objects)
// Create the clock
const clock = new THREE.Clock();
// Animation loop 
// Get UI elements
const maxVelocity = 10; // Adjust this value based on your needs
const posXElem = document.getElementById('pos-x');
const posYElem = document.getElementById('pos-y');
const posZElem = document.getElementById('pos-z');
const velXElem = document.getElementById('vel-x');
const velYElem = document.getElementById('vel-y');
const velZElem = document.getElementById('vel-z');
const speedBarElem = document.getElementById('speed-bar');
const speedValueElem = document.getElementById('speed-value');


function animate() {
    requestAnimationFrame(animate);

    objects.forEach((obj) => {
         obj.rotation.y += 0.00005;
    });

    let delta = clock.getDelta(); // Calcola il delta time
    if (activeCamera.value === followCamera) {
        updateFollowCamera(Spaceship_obj, followCamera);
    }
    if (activeCamera.value === TPcamera) {
        update3PCamera(Spaceship_obj, TPcamera);
    }
    if(Spaceship_obj){
    posXElem.textContent = Spaceship_obj.position.x.toFixed(2);
    posYElem.textContent = Spaceship_obj.position.y.toFixed(2);
    posZElem.textContent = Spaceship_obj.position.z.toFixed(2);
    moveSpaceship(Spaceship_obj,delta);
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
