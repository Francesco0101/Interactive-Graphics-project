import * as THREE from 'three';

export function createCameras(scene) {
    // Create the camera object with params
    const camera_param = {
        fov: 75,
        width: window.innerWidth,
        height: window.innerHeight,
        near: 0.1,
        far: 10000
      };

      // create a perspective camera with fov, aspect ratio, near and far clipping plane
      const camera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
      camera.position.set(500, 100, 200);
      
      // Create the follow camera to followe the spaceship from the top (not useful anymore)
      const followCamera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
      followCamera.position.set(0, 10, 0); //placeholder will be changed dinamically
      
      // Create the 3rd person camera to follow the spaceship from behind
      const TPcamera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
      followCamera.position.set(0, 50, 0); //placeholder will be changed dinamically
      
      let activeCamera = { value: camera }; //variable to switch between cameras

    return { camera, followCamera, TPcamera, activeCamera };
} 

//takes the spaceship object and the camera object and updates the camera position to follow the spaceship from top (followcamera) or behind (TPcamera)

export function updateFollowCamera(Spaceship_obj, followCamera) {
    if (Spaceship_obj) {
        followCamera.position.copy(Spaceship_obj.position).add(new THREE.Vector3(0, 15, 0)); // set the position to the copy of spaceship_obj because the position is a read only property
        followCamera.lookAt(Spaceship_obj.position); // set the lookAt to the spaceship_obj position (cosa fa?)
    }
}

export function update3PCamera(Spaceship_obj,TPcamera) {
    if (Spaceship_obj) {
        //The applyQuaternion method is called on this vector with the spaceship's quaternion. 
        //A quaternion represents the spaceship's rotation. 
        //This method adjusts the offset vector to account for the spaceship's current rotation
        //ensuring the camera is correctly positioned relative to the spaceship's orientation.
        const forward = new THREE.Vector3(0, 3, -15).applyQuaternion(Spaceship_obj.quaternion);
        TPcamera.position.copy(Spaceship_obj.position).add(forward);
        //The lookAt method is used to orient the camera so it always looks directly at the spaceship's current position.
        TPcamera.lookAt(Spaceship_obj.position);
    }
}
