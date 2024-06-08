import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

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
camera.position.set(70, 10, 10);

// Create the follow camera
const followCamera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
followCamera.position.set(0, 50, 0);

const TPcamera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width / camera_param.height, camera_param.near, camera_param.far);
followCamera.position.set(0, 50, 0);

let activeCamera = camera;

// Function to update the follow camera position
function updateFollowCamera() {
  if (Spaceship_obj) {
    followCamera.position.copy(Spaceship_obj.position).add(new THREE.Vector3(0, 50, 0));
    followCamera.lookAt(Spaceship_obj.position);
  }
}
// Update camera to be always behind the spaceship
function update3PCamera() {
  if (Spaceship_obj) {
    // TPcamera.position.copy(Spaceship_obj.position).add(new THREE.Vector3(0, 5, -10));
    // TPcamera.lookAt(Spaceship_obj.position);
    const forward = new THREE.Vector3(0, 2, -7).applyQuaternion(Spaceship_obj.quaternion);
    TPcamera.position.copy(Spaceship_obj.position).add(forward);
    TPcamera.lookAt(Spaceship_obj.position);
  }
}

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
}

function updateCamera() {
  camera.updateProjectionMatrix();
}

const gui_camera = new GUI();
gui_camera.add(camera, 'fov', 1, 180).onChange(updateCamera);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
gui_camera.add(minMaxGUIHelper, 'min', 0.1, 1000, 0.1).name('near').onChange(updateCamera);
gui_camera.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('far').onChange(updateCamera);

// Load and set the background texture
const textureLoader = new THREE.TextureLoader();
const backgroundImage = '4kback.jpg'; // Replace with the URL of your background image
textureLoader.load(backgroundImage, function(texture) {
  scene.background = texture;
});

// Crea il renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight); // Imposta le dimensioni iniziali del renderer

// Create the 3D ring (torus)

// Define the path for the ring
class CustomSinCurve extends THREE.Curve {
  constructor(scale) {
    super();
    this.scale = scale;
  }

  getPoint(t) {
    const angle = t * Math.PI * 2;
    const x = Math.cos(angle) * this.scale;
    const y = Math.sin(angle) * this.scale;
    const z = 0;
    return new THREE.Vector3(x, y, z);
  }
}

const path = new CustomSinCurve(75); // Major radius

// Define the rectangular cross-section
const shape = new THREE.Shape();
const width = 1; // Width of the track
const height = 10; // Height of the track
shape.moveTo(-width / 2, -height / 2);
shape.lineTo(width / 2, -height / 2);
shape.lineTo(width / 2, height / 2);
shape.lineTo(-width / 2, height / 2);
shape.lineTo(-width / 2, -height / 2);

const extrudeSettings = {
  steps: 100,
  extrudePath: path,
  bevelEnabled: false,
};

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshPhongMaterial({ color: 'green' });
const ringTrack = new THREE.Mesh(geometry, material);
ringTrack.rotation.x = Math.PI / 2;
scene.add(ringTrack);

//planet

const SphereGeometry = new THREE.IcosahedronGeometry(50, 5);
const SphereMaterial = new THREE.MeshPhongMaterial({ color: 'red', side: THREE.DoubleSide });
const BaseSphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
scene.add(BaseSphere);

//Create an ambient light
const color_ambient = 0xFFFFFF;
const intensity_ambient = 0.5;
const ambientLight = new THREE.AmbientLight(color_ambient, intensity_ambient);
scene.add(ambientLight);

//Load models
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

let object = [];

let Spaceship_obj;
mtlLoader.load('../ship_obj1/Model/Spaceship.mtl', (mtl) => {
  mtl.preload();
  for (const material of Object.values(mtl.materials)) {
    material.side = THREE.DoubleSide;
  }
  objLoader.setMaterials(mtl);
  objLoader.load('../ship_obj1/Model/Spaceship.obj', (Spaceship) => {
    object.push(Spaceship);
    Spaceship_obj = Spaceship;
    Spaceship.scale.set(0.01, 0.01, 0.01);
    Spaceship.position.set(75, 0, 0);
    scene.add(Spaceship);
  });
});

console.log(object);
object.forEach((obj) => { 
  console.log("CIAO");
  console.log(obj.position);
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

const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);

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

// Add a button to switch cameras
gui.add({ switchCamera: () => {
  activeCamera = activeCamera === camera ? followCamera : camera;
}}, 'switchCamera').name('isometric space Camera');

// Add a button to switch camera to 3rd person
gui.add({ switchCamera: () => {
  activeCamera = activeCamera === camera ? TPcamera : camera;
}}, 'switchCamera').name('3rd Person');

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  s: {
    pressed: false
  },
  w: {
    pressed: false
  },
  space: {
    pressed: false
  }
};
 
window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyA':
      keys.a.pressed = true;
      break;
    case 'KeyD':
      keys.d.pressed = true;
      break;
    case 'KeyS':
      keys.s.pressed = true;
      break;
    case 'KeyW':
      keys.w.pressed = true;
      break;
    case 'Space':
      keys.space.pressed = true;
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
      break;
    case 'KeyS':
      keys.s.pressed = false;
      break;
    case 'KeyW':
      keys.w.pressed = false;
      break;
    case 'Space': 
      keys.space.pressed = false;
      break;
  }
});

function moveSpaceship() {
  if (Spaceship_obj) {
    if(keys.space.pressed) {
      const forward = new THREE.Vector3(0, 0, 0.1).applyQuaternion(Spaceship_obj.quaternion);
      Spaceship_obj.position.add(forward);
    }
    if (keys.w.pressed) {
      // const forward = new THREE.Vector3(0, 0, 0.1).applyQuaternion(Spaceship_obj.quaternion);
      // Spaceship_obj.position.add(forward);
      Spaceship_obj.rotation.x -= 0.1;
    }
    if (keys.s.pressed) {
      // const forward = new THREE.Vector3(0, 0, -0.1).applyQuaternion(Spaceship_obj.quaternion);
      // Spaceship_obj.position.add(forward);
      Spaceship_obj.rotation.x += 0.1;
    }
    if (keys.a.pressed) {
      Spaceship_obj.rotation.y += 0.05;
    }
    if (keys.d.pressed) {
      Spaceship_obj.rotation.y -= 0.05;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (activeCamera === followCamera) {
    updateFollowCamera();
  }
  if (activeCamera === TPcamera) {
    update3PCamera();
  }
  moveSpaceship();
  renderer.render(scene, activeCamera);
}

animate();
