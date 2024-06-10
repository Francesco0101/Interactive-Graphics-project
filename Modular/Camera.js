import * as THREE from 'three';

export function createCameras(scene) {
    const camera_param = {
        fov: 75,
        width: window.innerWidth,
        height: window.innerHeight,
        near: 0.1,
        far: 3000
      };
      const camera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
      camera.position.set(70, 10, 10);
      
      // Create the follow camera
      const followCamera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
      followCamera.position.set(0, 10, 0);
      
      const TPcamera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
      followCamera.position.set(0, 50, 0);
      
      let activeCamera = { value: camera };

    return { camera, followCamera, TPcamera, activeCamera };
} 

export function updateFollowCamera(Spaceship_obj, followCamera) {
    if (Spaceship_obj) {
        followCamera.position.copy(Spaceship_obj.position).add(new THREE.Vector3(0, 15, 0));
        followCamera.lookAt(Spaceship_obj.position);
    }
}

export function update3PCamera(Spaceship_obj,TPcamera) {
    if (Spaceship_obj) {
        const forward = new THREE.Vector3(0, 2, -7).applyQuaternion(Spaceship_obj.quaternion);
        TPcamera.position.copy(Spaceship_obj.position).add(forward);
        TPcamera.lookAt(Spaceship_obj.position);
    }
}
