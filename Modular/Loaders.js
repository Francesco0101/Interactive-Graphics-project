import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import * as THREE from 'three';

export async function loadModels(scene) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    let Spaceship_obj;

    await mtlLoader.loadAsync('../ship_obj1/Model/Spaceship.mtl').then((mtl) => {
        mtl.preload();
        for (const material of Object.values(mtl.materials)) {
            material.side = THREE.DoubleSide;
        }
        objLoader.setMaterials(mtl);
        return objLoader.loadAsync('../ship_obj1/Model/Spaceship.obj');
    }).then((Spaceship) => {
        Spaceship.scale.set(0.01, 0.01, 0.01);
        Spaceship.position.set(75, 0, 0);
        Spaceship.velocity = new THREE.Vector3(0, 0, 0); // initial velocity
        Spaceship.acceleration = new THREE.Vector3(0, 0, 0); // initial acceleration
        scene.add(Spaceship);
        Spaceship_obj = Spaceship;
    });

    return { Spaceship_obj };
} 


export function loadBackground(scene){
    // Load and set the background texture
    const textureLoader = new THREE.TextureLoader();
    const backgroundImage = '../Scene/4kback.jpg'; // Replace with the URL of your background image
    console.log("Loading background image...");
    textureLoader.load(backgroundImage, function(texture) {
    scene.background = texture;
    });

}