import { createScene, createRenderer, createLights, createPlanet } from './SceneSetup.js';
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
loadBackground(scene)
// Create GUI
setupGUI(camera, activeCamera, followCamera, TPcamera, controls, scene);
console.log("camera: ",camera)
console.log("activeCamera: ",activeCamera.value)
console.log("followCamera: ",followCamera)
console.log("TPcamera: ",TPcamera)
console.log("scene: ",scene)
console.log("controls: ",controls)
// Create planet
createPlanet(scene);

// Animation loop 
function animate() {
    requestAnimationFrame(animate);
    
    if (activeCamera.value === followCamera) {
        updateFollowCamera(Spaceship_obj, followCamera);
    }
    if (activeCamera.value === TPcamera) {
        update3PCamera(Spaceship_obj, TPcamera);
    }
    moveSpaceship(Spaceship_obj);
    renderer.render(scene, activeCamera.value);
}

animate();
