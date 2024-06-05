import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
// Crea la scena
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');
// Crea una camera
const camera_param = {
  fov: 75,
  width: window.innerWidth,
  height: window.innerHeight,
  near: 0.1,
  far: 1000
};

const camera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
camera.position.set(0, 10,10);

// Crea il renderer

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight); // Imposta le dimensioni iniziali del renderer


//Load models
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

let object = [];

// let Spaceship_obj;
mtlLoader.load('../ship_obj1/Model/Spaceship.mtl', (mtl) => {
  mtl.preload();
  for (const material of Object.values(mtl.materials)) {
    material.side = THREE.DoubleSide;
  }
  objLoader.setMaterials(mtl);
  objLoader.load('../ship_obj1/Model/Spaceship.obj', (Spaceship) => {
    // Spaceship_obj = Spaceship;
    object.push(Spaceship);
    Spaceship.scale.set(0.05, 0.05, 0.05)
    Spaceship.position.set(0, 0, 0);
    scene.add(Spaceship);
  });
});

console.log(object);
object.forEach((obj) => { 
  console.log("CIAO")
  console.log(obj.position) ;
  obj.rotation.y += 180; 
});

// Crea il controllo OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();


class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
//Controls light_dir

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  folder.open();
}

const color = 0xFFFFFF;
const intensity_dir = 1;
const light = new THREE.DirectionalLight(color, intensity_dir);
light.position.set(0, 30, 0);
light.target.position.set(-5, 20, 0);
scene.add(light);
scene.add(light.target);

const helper = new THREE.DirectionalLightHelper( light );
scene.add( helper );

function updateLight() {
  light.target.updateMatrixWorld();
  helper.update();
}
updateLight();

const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 2, 0.01);

makeXYZGUI(gui, light.position, 'position', updateLight);
makeXYZGUI(gui, light.target.position, 'target', updateLight);



function animate() {
  requestAnimationFrame(animate);

  object.forEach((obj) => { 
    console.log(obj.position) ;
    obj.rotation.y += 0.01; 
    obj.rotation.x += 0.01;
    obj.rotation.z += 0.01;
  });
  renderer.render(scene, camera);
}

animate();
