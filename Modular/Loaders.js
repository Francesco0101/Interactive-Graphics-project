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
        mtl.preload(); // Preload the materials
        for (const material of Object.values(mtl.materials)) {
            material.side = THREE.DoubleSide; // Set material side to double-sided
        }
        objLoader.setMaterials(mtl); // Set the loaded materials to the OBJLoader
        return objLoader.loadAsync('../ship_obj1/Model/Spaceship.obj');
    }).then((Spaceship) => { // Once the .obj file is loaded
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
        Spaceship.scale.set(0.03, 0.03, 0.03);
        Spaceship.position.set(370, 60, 200);

        //rotate the spaceship by pi/2

        Spaceship.rotation.y =- Math.PI / 2;
        Spaceship.velocity = new THREE.Vector3(0, 0, 0); // initial velocity
        Spaceship.MaxVelocity = 100; // Set your desired max velocity
        Spaceship.FuelEmpty = false;
        Spaceship.MaxFuel = 1000;
        Spaceship.Fuel = 100;

        Spaceship.boundingBox = new THREE.Box3().setFromObject(Spaceship);
        // calculate the mean lenght of the bounding box
        Spaceship.side_len = (Spaceship.boundingBox.max.x - Spaceship.boundingBox.min.x + Spaceship.boundingBox.max.y - Spaceship.boundingBox.min.y + Spaceship.boundingBox.max.z - Spaceship.boundingBox.min.z) / 3;



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
        Spaceship_gui.add({ resetPosition: () => {
            Spaceship.position.set(400, 60, 200);
            Spaceship.velocity.set(0, 0, 0);
        }}, 'resetPosition').name('Reset Position');
        Spaceship_gui.add({ toggleBoundingBox: () => {
            Spaceship.boxHelper.visible = !Spaceship.boxHelper.visible;
        }}, 'toggleBoundingBox').name('Toggle Bounding Box');
        Spaceship_gui.add({ refillFuel: () => {
            Spaceship.Fuel = Spaceship.MaxFuel;
        }}, 'refillFuel').name('Refill Fuel');
        
        // Spaceship_gui.open();
    });

    return { Spaceship_obj };
}

// load station fbx
export async function loadFbx(scene) {
    const fbxLoader = new FBXLoader();

    let Station_fbx;
    const bonusRange = new THREE.SphereGeometry(60, 32, 32); // Adjust radius as needed
    const rangeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const rangeSphere = new THREE.Mesh(bonusRange, rangeMaterial);
    rangeSphere.name = 'Station'

    await fbxLoader.loadAsync('../SP1/3DEC_07.fbx').then((Station) => {


        Station.scale.set(0.15, 0.15, 0.15);
        Station.position.set(400, 50, 250);
        Station.rotation.y =Math.PI ;
        scene.add(Station);
        Station_fbx = Station;
        rangeSphere.position.copy(Station.position);
        scene.add(rangeSphere);
        rangeSphere.visible = false; // Make the sphere invisible by default
        // Initialize the GUI
        const gui_station = new GUI();
        const Station_Gui = gui_station.addFolder('Stations one Controls');
        // Add a button to remove the wireframe
        Station_Gui.add({ Wireframe: () => {
            if (rangeSphere.visible) {
            rangeSphere.visible = false; // Make the sphere invisible
            }
            else {
            rangeSphere.visible = true; // Make the sphere visible
            }
        }}, 'Wireframe').name('Wireframe');
        Station_Gui.open();
        
    });

    return { Station_fbx , rangeSphere};
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
        scene.add(fbx);
        model = fbx;

    });

    return { model };
}

export function loadBackground(scene, renderer) {
    const backgroundImage = '../Scene/4kback.jpg'; 
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
        backgroundImage,
      () => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
      });

}



