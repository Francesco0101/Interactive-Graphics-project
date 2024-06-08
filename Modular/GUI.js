import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { MinMaxGUIHelper, ColorGUIHelper, makeXYZGUI } from './Helpers.js';

function updateLight(light,helper) {
    light.target.updateMatrixWorld();
    helper.update();
  }

export function setupGUI(camera, activeCamera, followCamera, TPcamera, controls, scene) {
    const gui_camera = new GUI();
    gui_camera.add(camera, 'fov', 1, 180).onChange(() => camera.updateProjectionMatrix());
    
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui_camera.add(minMaxGUIHelper, 'min', 0.1, 1000, 0.1).name('near').onChange(() => camera.updateProjectionMatrix());
    gui_camera.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('far').onChange(() => camera.updateProjectionMatrix());
    
    gui_camera.add({ switchCamera: () => {
        activeCamera.value = activeCamera.value === camera ? followCamera : camera;
      }}, 'switchCamera').name('isometric space Camera');
 
    gui_camera.add({ switchCamera: () => {
        activeCamera.value = activeCamera.value === camera ? TPcamera : camera;
      }}, 'switchCamera').name('3rd Person');

    const gui_light = new GUI();
    const light = scene.children.find(child => child instanceof THREE.DirectionalLight);
    gui_light.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui_light.add(light, 'intensity', 0, 2, 0.01);
    const helper = scene.children.find(child => child instanceof THREE.DirectionalLightHelper);
    console.log("camera attiva: ", activeCamera.value)

    // makeXYZGUI(gui_light, light.position, 'position', () => light.target.updateMatrixWorld());
    // makeXYZGUI(gui_light, light.target.position, 'target', () => light.target.updateMatrixWorld());
    makeXYZGUI(gui_light, light.position, 'position', updateLight(light,helper));
    makeXYZGUI(gui_light, light.target.position, 'target', updateLight(light,helper));

      
}


