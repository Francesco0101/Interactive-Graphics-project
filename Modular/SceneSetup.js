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

    // Adding a point light
    const color_point = 0xFFFFFF;
    const intensity_point = 1000;
    const distance_point = 1000; // distance over which the light is dispersed
    const decay_point = 1; // how the light dims over distance

    const pointLight = new THREE.PointLight(color_point, intensity_point, distance_point, decay_point);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const helper = new THREE.PointLightHelper(pointLight);
    scene.add(helper);
}

export function CreateRingedPlanet(scene, radius, detail,texture_url, ring_url) {
    const SphereGeometry = new THREE.IcosahedronGeometry(radius, detail);
    const SphereMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(texture_url)});
    const BaseSphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
    BaseSphere.radius = radius;
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

const path = new CustomSinCurve(40); // Major radius

// Define the rectangular cross-section
const shape = new THREE.Shape();
const width = 1; // Width of the track
const height = 5; // Height of the track
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
const material = new THREE.MeshPhongMaterial({  map: new THREE.TextureLoader().load(ring_url)});
const ringTrack = new THREE.Mesh(geometry, material);
ringTrack.boundingBox = new THREE.Box3().setFromObject(ringTrack); // Calculate bounding box
ringTrack.rotation.x = Math.PI / 2;
scene.add(ringTrack);
return ringTrack;
}


function CreatePlanet(scene, objects ,radius, detail, color, emissive , x = 0, y = 0, z = 0, texture_url) {
  const Orbit = new THREE.Object3D();
  Orbit.position.set(x, y, z);
  objects.push(Orbit);
  scene.add(Orbit);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(texture_url);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, detail, detail), material);
  mesh.radius = radius;
  Orbit.add(mesh);
  objects.push(mesh);

  
}

function CreatePlanetAndMoon(scene, objects ,radius, detail, color, emissive , x_p = 0, y_p = 0, z_p = 0 ,scale = 0.5, x_m = 0, y_m = 0, z_m = 0, texture_planet_url, texture_moon_url) {
  const Orbit = new THREE.Object3D();
  Orbit.position.set(x_p, y_p, z_p);
  objects.push(Orbit);
  scene.add(Orbit);
  const textureLoader = new THREE.TextureLoader();
  const texture_planet = textureLoader.load(texture_planet_url);
  const material = new THREE.MeshPhongMaterial({ map: texture_planet });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, detail, detail), material);
  mesh.radius = radius;

  Orbit.add(mesh);
  objects.push(mesh);
  
  const MoonOrbit = new THREE.Object3D();
  MoonOrbit.position.set(x_m, y_m, z_m);
  Orbit.add(MoonOrbit);
  const textureLoader_moon = new THREE.TextureLoader();
  const texture_moon = textureLoader_moon.load(texture_moon_url);
  const MoonMaterial = new THREE.MeshPhongMaterial({map: texture_moon ,emissive: 0x112244});
  const MoonMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, detail, detail), MoonMaterial);
  MoonMesh.scale.set(scale, scale, scale);
  MoonMesh.boundingBox = new THREE.Box3().setFromObject(MoonMesh); // Calculate bounding box
  MoonMesh.radius = radius*scale;

  MoonOrbit.add(MoonMesh);
  objects.push(MoonMesh)

}

export function CreateSystem(scene){
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  const sun_radius = 5;
  const sphereGeometry = new THREE.SphereGeometry(sun_radius, 32, 32);
  const Planets = [];
  const Rings = [];
  Planets.push(solarSystem)

  const textureLoader = new THREE.TextureLoader();
  const suntext = textureLoader.load('../Textures/8k_sun.jpg');
  const sunMaterial = new THREE.MeshPhongMaterial({
    map: suntext,
    emissive: 'orange', // A yellowish color for the sun
    emissiveIntensity: 0.3 // Adjust this value to increase the emissive effect
  });

  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  const sun_scale = 30;
  sunMesh.scale.set(sun_scale, sun_scale, sun_scale);
  sunMesh.radius = sun_radius*sun_scale;


  solarSystem.add(sunMesh);
  Planets.push(sunMesh)
  

    
  //CreatePlanet(scene, objects ,radius, detail, color, emissive , x = 0, y = 0, z = 0)
  const texture_jup= '../Textures/jup.jpg';
  const texture_moon = '../Textures/Callisto-1.jpg';
  const texture_Orc = '../Textures/Orcus.jpg';
  const texture_venus = '../Textures/venus.jpg';
  const texture_makemake = '../Textures/makemake.jpg';
  const texture_saturn = '../Textures/8k_saturn.jpg';
  const texture_ring = '../Textures/sat_ring.png';
  const texture_taranis = '../Textures/Taranis.png';
  const texture_ceres = '../Textures/ceres.jpg';
  const texture_haumema = '../Textures/haumema.jpg';

  CreatePlanet (solarSystem, Planets, 15, 32, 'red', 0x112244, 300, 0, 0 , texture_venus);

  CreatePlanetAndMoon(solarSystem, Planets, 10, 32, 'blue', 0x112244, 400, -20 , 0, 0.5, 20, 0, 0, texture_makemake, texture_ceres);

  CreatePlanetAndMoon(solarSystem, Planets, 10, 32, 'yellow', 0x112244,-400, 0, 0, 1, 40, 0, 0, texture_Orc, texture_Orc);

  CreatePlanetAndMoon(solarSystem, Planets, 50, 32, 'orange', 0x112244, 0, 20, 500, 0.2, 80, 0, 0, texture_jup, texture_moon);

  CreatePlanet(solarSystem, Planets, 10, 32, 'pink', 0x112244, -600 , 10, 0, texture_taranis);
  
  CreatePlanet(solarSystem, Planets, 25, 32, 'purple', 0x112244, 0, -10, -500, texture_haumema);  

  const fifthPlanetOrbit = new THREE.Object3D();
  fifthPlanetOrbit.position.set(-500, 50, 500);
  solarSystem.add(fifthPlanetOrbit);
  Planets.push(fifthPlanetOrbit)

  let Ring1 = CreateRingedPlanet(fifthPlanetOrbit, 25 , 32 ,texture_saturn , texture_ring);
  Rings.push(Ring1)

  const sixthPlanetOrbit = new THREE.Object3D();
  sixthPlanetOrbit.position.set(500, 0, -500);
  solarSystem.add(sixthPlanetOrbit);
  Planets.push(sixthPlanetOrbit)

  let Ring2= CreateRingedPlanet(sixthPlanetOrbit, 25 , 32,texture_saturn , texture_ring);
  Rings.push(Ring2)
  //add ring to return 
  return Planets;
}

