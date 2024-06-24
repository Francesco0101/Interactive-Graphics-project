import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//OrbitControls allows to move the camera around a target point by dragging the mouse.
export function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    // Set the target point for the controls, which is the point the camera will orbit around
    controls.target.set(0, 5, 0);
    controls.update();
    return controls;
}
 