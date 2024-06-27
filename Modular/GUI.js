import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { MinMaxGUIHelper, ColorGUIHelper, makeXYZGUI } from './Helpers.js';

// Function to set up a GUI for controlling various parameters in the scene
export function setupGUI(camera, activeCamera, followCamera, TPcamera, scene) {
    const gui = new GUI();
    const gui_camera = gui.addFolder('Camera_params');

    // Add a control for the camera's field of view and update the projection matrix on change
    gui_camera.add(camera, 'fov', 1, 180).onChange(() => camera.updateProjectionMatrix());
    
    // Create a helper for controlling the camera's near and far clipping planes
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui_camera.add(minMaxGUIHelper, 'min', 0.1, 1000, 0.1).name('near').onChange(() => camera.updateProjectionMatrix());
    gui_camera.add(minMaxGUIHelper, 'max', 0.1, 10000, 0.1).name('far').onChange(() => camera.updateProjectionMatrix());
    
    // Add a control to switch between cameras
    gui_camera.add({ switchCamera: () => {
        activeCamera.value = activeCamera.value === camera ? followCamera : camera;
      }}, 'switchCamera').name('isometric space Camera');
 
    gui_camera.add({ switchCamera: () => {
        activeCamera.value = activeCamera.value === camera ? TPcamera : camera;
      }}, 'switchCamera').name('3rd Person');
    gui_camera.open();
    // Find the point light and point light helper in the scene
    const pointLight = scene.children.find(child => child instanceof THREE.PointLight);
    const pointLightHelper = scene.children.find(child => child instanceof THREE.PointLightHelper);
    
    // PointLight controls
    const lightFolder = gui.addFolder('Sun_Light');
    lightFolder.add(pointLight, 'intensity', 0, 1000).name('intensity'); //  intensity property determines the brightness of the light.
    lightFolder.add(pointLight, 'distance', 0, 1000).name('distance');  // The distance property specifies how far the light travels from its source before it diminishes to zero.
    lightFolder.add(pointLight, 'decay', 0, 2).name('decay'); // decay property determines the rate at which the light intensity decreases as it travels away from the source.
    
    // PointLightHelper visibility toggle
    lightFolder.add({ helperVisible: true }, 'helperVisible').name('Helper Visible').onChange((value) => {
        pointLightHelper.visible = value;
    });

}


