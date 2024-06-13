import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { AddAxesHelper } from './Helpers.js';
import { GUI } from 'dat.gui';
import * as THREE from 'three';


export async function loadModels1(scene) {
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
        // Re-center geometry
        Spaceship.traverse((child) => {
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
                const boundingBox = child.geometry.boundingBox;
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                child.geometry.translate(-center.x, -center.y, -center.z + 1); // Adjust the center position as needed
            }
        });

        Spaceship.scale.set(0.01, 0.01, 0.01);
        Spaceship.position.set(180, 20, 0);
        Spaceship.velocity = new THREE.Vector3(0, 0, 0); // initial velocity
        Spaceship.acceleration = new THREE.Vector3(0, 0, 0); // initial acceleration
        Spaceship.MaxVelocity = 10; // Set your desired max velocity
        Spaceship.FuelEmpty = false;
        Spaceship.MaxFuel = 100;
        Spaceship.Fuel = 100;

        Spaceship.boundingBox = new THREE.Box3().setFromObject(Spaceship);
        scene.add(Spaceship);
        Spaceship_obj = Spaceship;
        AddAxesHelper(Spaceship_obj);
        // Add bounding box helper and make it able to be disabled with the GUI 
        const boxHelper = new THREE.BoxHelper(Spaceship, 0xffff00);
        boxHelper.visible = false;
        scene.add(boxHelper);
        Spaceship.boxHelper = boxHelper; // Store reference for updates

        // Initialize the GUI
        const gui_ship = new GUI();
        const Spaceship_gui = gui_ship.addFolder('Spaceship Controls');
        Spaceship_gui.add(Spaceship, 'MaxVelocity', 0, 100).name('Max Velocity');
        Spaceship_gui.add(Spaceship, 'Fuel', 0, 100).name('Fuel');
        Spaceship_gui.add({ resetPosition: () => {
            Spaceship.position.set(180, 20, 0);
            Spaceship.velocity.set(0, 0, 0);
            Spaceship.acceleration.set(0, 0, 0);
        }}, 'resetPosition').name('Reset Position');
        Spaceship_gui.add({ toggleBoundingBox: () => {
            Spaceship.boxHelper.visible = !Spaceship.boxHelper.visible;
        }}, 'toggleBoundingBox').name('Toggle Bounding Box');
        Spaceship_gui.add({ refillFuel: () => {
            Spaceship.Fuel = Spaceship.MaxFuel;
        }}, 'refillFuel').name('Refill Fuel');
        Spaceship_gui.open();
    });

    return { Spaceship_obj };
}
//LOAD ONLY OBJ 

export async function loadModels2(scene, scale = 1, position = { x: 200, y: 0, z: 0 }) {
    const objLoader = new OBJLoader();

    let Spaceship_obj;

    await objLoader.loadAsync('../death/source/death.obj').then((Spaceship) => {
        // Re-center geometry
        Spaceship.traverse((child) => {
            console.log("child: ",child)
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
                const boundingBox = child.geometry.boundingBox;
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                child.geometry.translate(-center.x, -center.y, -center.z + 1); // Adjust the center position as needed
            }
        });

        Spaceship.scale.set(1, 1, 1);
        Spaceship.position.set(180, 20, 0);
        Spaceship.velocity = new THREE.Vector3(0, 0, 0); // initial velocity
        Spaceship.acceleration = new THREE.Vector3(0, 0, 0); // initial acceleration
        Spaceship.MaxVelocity = 10; // Set your desired max velocity
        Spaceship.FuelEmpty = false;
        Spaceship.MaxFuel = 100;
        Spaceship.Fuel = 100;

        Spaceship.boundingBox = new THREE.Box3().setFromObject(Spaceship);
        scene.add(Spaceship);
        Spaceship_obj = Spaceship;
        AddAxesHelper(Spaceship_obj);
        // Add bounding box helper and make it able to be disabled with the GUI 
        const boxHelper = new THREE.BoxHelper(Spaceship, 0xffff00);
        boxHelper.visible = false;
        scene.add(boxHelper);
        Spaceship.boxHelper = boxHelper; // Store reference for updates

        // Initialize the GUI
        const gui_ship = new GUI();
        const Spaceship_gui = gui_ship.addFolder('Spaceship Controls');
        Spaceship_gui.add(Spaceship, 'MaxVelocity', 0, 100).name('Max Velocity');
        Spaceship_gui.add(Spaceship, 'Fuel', 0, 100).name('Fuel');
        Spaceship_gui.add({ resetPosition: () => {
            Spaceship.position.set(180, 20, 0);
            Spaceship.velocity.set(0, 0, 0);
            Spaceship.acceleration.set(0, 0, 0);
        }}, 'resetPosition').name('Reset Position');
        Spaceship_gui.add({ toggleBoundingBox: () => {
            Spaceship.boxHelper.visible = !Spaceship.boxHelper.visible;
        }}, 'toggleBoundingBox').name('Toggle Bounding Box');
        Spaceship_gui.add({ refillFuel: () => {
            Spaceship.Fuel = Spaceship.MaxFuel;
        }}, 'refillFuel').name('Refill Fuel');
        Spaceship_gui.open();
    });

    return { Spaceship_obj };
}

//LOAD FBX WITH PNG TEXTURES

export async function loadFortnite(scene, scale = 0.005, position = { x: 0, y: 0, z: 0 }) {
    const fbxLoader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();

    let model;

    await fbxLoader.loadAsync('../fortnite/source/Bot.fbx').then((fbx) => {
        // Load the texture
        const diffuseTexture = textureLoader.load('../fortnite/textures/T_M_MED_Multibot_Body_D.tga.png');

        fbx.traverse((child) => {
            if (child.isMesh) {
                // Create a new material or update the existing material
                const material = new THREE.MeshStandardMaterial({
                    map: diffuseTexture,
                });

                // Apply the material to the mesh
                child.material = material;
                child.material.needsUpdate = true;
            }
        });

        // Set model properties
        fbx.scale.set(scale, scale, scale);
        fbx.position.set(position.x, position.y, position.z);
        fbx.velocity = new THREE.Vector3(0, 0, 0); // initial velocity
        fbx.acceleration = new THREE.Vector3(0, 0, 0); // initial acceleration
        fbx.MaxVelocity = 10; // Set your desired max velocity
        scene.add(fbx);
        model = fbx;

    });

    return { model };
}

export function loadBackground(scene, renderer) {
    //Load and set the background texture
    const textureLoader = new THREE.TextureLoader();
    const backgroundImage = '../Scene/4kback.jpg'; 
    console.log("Loading background image...");
    textureLoader.load(
        backgroundImage,
        function(texture) {
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); 
            scene.background = texture;
        },
        undefined,
        function(error) {
            console.error('Error loading texture:', error);
        }
    );
}