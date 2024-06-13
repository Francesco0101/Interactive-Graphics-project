import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { MinMaxGUIHelper, ColorGUIHelper, makeXYZGUI } from './Helpers.js';

export function setupGUI(camera, activeCamera, followCamera, TPcamera, scene) {
    const gui = new GUI();
    const gui_camera = gui.addFolder('Camera_params');
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

    const pointLight = scene.children.find(child => child instanceof THREE.PointLight);
    const pointLightHelper = scene.children.find(child => child instanceof THREE.PointLightHelper);
    // PointLight controls
    const lightFolder = gui.addFolder('Sun_Light');
    lightFolder.add(pointLight.position, 'x', -500, 500).name('posX');
    lightFolder.add(pointLight.position, 'y', -500, 500).name('posY');
    lightFolder.add(pointLight.position, 'z', -500, 500).name('posZ');
    lightFolder.add(pointLight, 'intensity', 0, 1000).name('intensity');
    lightFolder.add(pointLight, 'distance', 0, 1000).name('distance');
    lightFolder.add(pointLight, 'decay', 0, 2).name('decay');
    
    // PointLightHelper visibility toggle
    lightFolder.add({ helperVisible: true }, 'helperVisible').name('Helper Visible').onChange((value) => {
        pointLightHelper.visible = value;
    });

}


