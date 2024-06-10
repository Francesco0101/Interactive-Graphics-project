import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    return scene;
}

export function createRenderer() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); //Set correct pixel ratio for high definition
    renderer.capabilities.getMaxAnisotropy();
    return renderer;
}

export function createLights(scene) {
    const color_amb = 0xFFFFFF;
    const intensity_amb = 0.5;

    const ambientLight = new THREE.AmbientLight(color_amb, intensity_amb);
    scene.add(ambientLight);

    const color_dir = 0xFFFFFF;
    const intensity_dir = 1;

    const dir_light = new THREE.DirectionalLight(color_dir, intensity_dir);
    dir_light.position.set(0, 100, 0);
    dir_light.target.position.set(-5, 90, 0);
    scene.add(dir_light);
    scene.add(dir_light.target);

    const helper = new THREE.DirectionalLightHelper(dir_light);
    scene.add(helper);
}

export function CreateRingedPlanet(scene, radius, detail) {
    const SphereGeometry = new THREE.IcosahedronGeometry(radius, detail);
    const SphereMaterial = new THREE.MeshPhongMaterial({ color: 'red', side: THREE.DoubleSide });
    const BaseSphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
    scene.add(BaseSphere);
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

const path = new CustomSinCurve(10); // Major radius

// Define the rectangular cross-section
const shape = new THREE.Shape();
const width = 1; // Width of the track
const height = 1; // Height of the track
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
}

function CreatePlanet(scene, objects ,radius, detail, color, emissive , x = 0, y = 0, z = 0) {
  const Orbit = new THREE.Object3D();
  Orbit.position.set(x, y, z);
  objects.push(Orbit);
  scene.add(Orbit);

  const material = new THREE.MeshPhongMaterial({ color: color, emissive: emissive });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, detail, detail), material);
  Orbit.add(mesh);
  objects.push(mesh);
}

export function CreateSystem(scene){
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
  const objects = [];
  objects.push(solarSystem)


  const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(15, 15, 15);
  solarSystem.add(sunMesh);
  objects.push(sunMesh)

  const firstPlanetOrbit = new THREE.Object3D();
  firstPlanetOrbit.position.x = 50;
  sunMesh.add(firstPlanetOrbit);
  objects.push(firstPlanetOrbit)

  const firstPlanetMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
  const firstPlanetMesh = new THREE.Mesh(sphereGeometry, firstPlanetMaterial);
  firstPlanetOrbit.add(firstPlanetMesh);
  objects.push(firstPlanetMesh)
  
  const secondPlanetOrbit = new THREE.Object3D();
  secondPlanetOrbit.position.x = 100;
  solarSystem.add(secondPlanetOrbit);
  objects.push(secondPlanetOrbit)

  const secondPlanetMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
  const secondPlanetMesh = new THREE.Mesh(sphereGeometry, secondPlanetMaterial);
  secondPlanetOrbit.add(secondPlanetMesh);
  objects.push(secondPlanetMesh)

  const firstMoonOrbit = new THREE.Object3D();
  firstMoonOrbit.position.x = 20;
  secondPlanetOrbit.add(firstMoonOrbit);

  const firstMoonMaterial = new THREE.MeshPhongMaterial({color: '0x888888', emissive: 0x222222});
  const firstMoonMesh = new THREE.Mesh(sphereGeometry, firstMoonMaterial);
  firstMoonMesh.scale.set(.5, .5, .5);
  firstMoonOrbit.add(firstMoonMesh);
  objects.push(firstMoonMesh)

  const thirdPlanetOrbit = new THREE.Object3D();
  thirdPlanetOrbit.position.x = -100;
  solarSystem.add(thirdPlanetOrbit);
  objects.push(thirdPlanetOrbit)

  const thirdPlanetMaterial = new THREE.MeshPhongMaterial({color: 'green', emissive: 0x112244});
  const thirdPlanetMesh = new THREE.Mesh(sphereGeometry, thirdPlanetMaterial);
  thirdPlanetOrbit.add(thirdPlanetMesh);
  objects.push(thirdPlanetMesh)

  const secondMoonOrbit = new THREE.Object3D();
  secondMoonOrbit.position.x = 20;
  thirdPlanetOrbit.add(secondMoonOrbit);

  const secondMoonMaterial = new THREE.MeshPhongMaterial({color: '0x888888', emissive: 0x222222});
  const secondMoonMesh = new THREE.Mesh(sphereGeometry, secondMoonMaterial);
  secondMoonMesh.scale.set(.5, .5, .5);
  secondMoonOrbit.add(secondMoonMesh);
  objects.push(secondMoonMesh)



  const fourthPlanetOrbit = new THREE.Object3D();
  fourthPlanetOrbit.position.x = 150;
  solarSystem.add(fourthPlanetOrbit);
  objects.push(fourthPlanetOrbit)

  const fourthPlanetMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
  const fourthPlanetMesh = new THREE.Mesh(sphereGeometry, fourthPlanetMaterial);
  fourthPlanetOrbit.add(fourthPlanetMesh);
  objects.push(fourthPlanetMesh)

  const fifthPlanetOrbit = new THREE.Object3D();
  fifthPlanetOrbit.position.x = 200;
  solarSystem.add(fifthPlanetOrbit);
  objects.push(fifthPlanetOrbit)

  CreateRingedPlanet(fifthPlanetOrbit, 5 , 32);

  const sixthPlanetOrbit = new THREE.Object3D();
  sixthPlanetOrbit.position.x = -200;
  solarSystem.add(sixthPlanetOrbit);
  objects.push(sixthPlanetOrbit)

  CreateRingedPlanet(sixthPlanetOrbit, 5 , 32);

  CreatePlanet (solarSystem, objects, 5, 32, 'purple', 0x112244, 300, 0, 0);

  return objects;
}
  