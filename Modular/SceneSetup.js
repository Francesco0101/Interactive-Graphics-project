import * as THREE from 'three';
import {loadFbx} from './Loaders.js';

// Function to create the empty scene
export function createScene() { 
    const scene = new THREE.Scene(); // Create a new scene
    scene.background = new THREE.Color('black'); // Set the background color to black
    return scene;
}
// Function to create the renderer
export function createRenderer() {
    const canvas = document.querySelector('#c'); // Get the canvas element wiith the id 'c'
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas }); // Create a new WebGLRenderer and set the canvas
    renderer.setSize(window.innerWidth, window.innerHeight); 
    renderer.setPixelRatio(window.devicePixelRatio); //Set correct pixel ratio for high definition
    renderer.capabilities.getMaxAnisotropy(); 
    return renderer;
}
// Function to create the lights
export function createLights(scene) {
    const color_amb = 0xFFFFFF;
    const intensity_amb = 0.3; 

    const ambientLight = new THREE.AmbientLight(color_amb, intensity_amb); // Create an ambient light
    scene.add(ambientLight); // Add the ambient light to the scene

    // Adding a point light
    const color_point = 0xFFFFFF;
    const intensity_point = 1000;
    const distance_point = 1000; // distance over which the light is dispersed
    const decay_point = 1; // how the light dims over distance

    const pointLight = new THREE.PointLight(color_point, intensity_point, distance_point, decay_point); // Create a point light representing the sun
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight); // Add the point light to the scene

    const helper = new THREE.PointLightHelper(pointLight); // Create a point light helper to visualize the light
    scene.add(helper);
}
// Function to create a Ringed Planet
export function CreateRingedPlanet(scene,objects, radius, detail,texture_url, ring_url) {
    const SphereGeometry = new THREE.SphereGeometry(radius, detail, detail)
    // phong material property is to give the sphere a shiny appearance
    const SphereMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(texture_url)}); // Create the 3D sphere material with a texture, it uses the standard uv mapping
    const BaseSphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
    BaseSphere.radius = radius;
    BaseSphere.name = "saturn"
    scene.add(BaseSphere);
    objects.push(BaseSphere)
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

const extrudeSettings = { // Settings for the extrusion which is the path of the ring
  steps: 100, 
  extrudePath: path,
  bevelEnabled: false, 
};

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshPhongMaterial({  map: new THREE.TextureLoader().load(ring_url)});
const ringTrack = new THREE.Mesh(geometry, material);
ringTrack.rotation.x = Math.PI / 2;
scene.add(ringTrack);
}

// Function to create a lone planet
function CreatePlanet(scene, objects ,radius, detail, color, emissive , x = 0, y = 0, z = 0, texture_url) {
  const Orbit = new THREE.Object3D(); // Create an empty 3D object to represent the planet's orbit
  Orbit.position.set(x, y, z); // Set the position of the orbit
  Orbit.name = 'SinglePlanet'
  objects.push(Orbit); 
  scene.add(Orbit); // Add the orbit to the scene
  const textureLoader = new THREE.TextureLoader(); 
  const texture = textureLoader.load(texture_url);
  const material = new THREE.MeshPhongMaterial({ map: texture }); // Create the 3D material for the planet
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, detail, detail), material); // Create the 3D mesh for the planet
  mesh.radius = radius;
  mesh.name = 'Planet'
  Orbit.add(mesh); // Add the planet mesh to the orbit
  objects.push(mesh)
 

  
}
// Function to create a planet with a moon
function CreatePlanetAndMoon(scene, objects ,radius, detail, color, emissive , x_p = 0, y_p = 0, z_p = 0 ,scale = 0.5, x_m = 0, y_m = 0, z_m = 0, texture_planet_url, texture_moon_url) {
  const Orbit = new THREE.Object3D(); // Create an empty 3D object to represent the planet's orbit
  Orbit.name = 'PlanetWithMoon'
  Orbit.position.set(x_p, y_p, z_p); // Set the position of the orbit
  objects.push(Orbit);
  scene.add(Orbit);
  const textureLoader = new THREE.TextureLoader(); 
  const texture_planet = textureLoader.load(texture_planet_url);
  const material = new THREE.MeshPhongMaterial({ map: texture_planet }); // Create the 3D material for the planet
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, detail, detail), material); // Create the 3D mesh for the planet
  mesh.radius = radius;
  mesh.name= 'PlanetWithMoon'
  objects.push(mesh)

  Orbit.add(mesh);  // Add the planet mesh to the orbit
  
  
  const MoonOrbit = new THREE.Object3D();  // Create an empty 3D object to represent the moon's orbit
  MoonOrbit.name = 'MoonOfPlanet'
  MoonOrbit.position.set(x_m, y_m, z_m);
  Orbit.add(MoonOrbit);
  const textureLoader_moon = new THREE.TextureLoader();
  const texture_moon = textureLoader_moon.load(texture_moon_url);
  const MoonMaterial = new THREE.MeshPhongMaterial({map: texture_moon});
  const MoonMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, detail, detail), MoonMaterial);
  MoonMesh.scale.set(scale, scale, scale);
  MoonMesh.radius = radius*scale;
  MoonMesh.name = 'Moon'
  MoonOrbit.add(MoonMesh); // Add the moon mesh to the moon orbit
  objects.push(MoonMesh)
  

}
// function to create the solar system
export function CreateSystem(scene){
  const solarSystem = new THREE.Object3D(); // Create an empty 3D object to represent the solar system
  solarSystem.name = 'Solar System'; // Set the name of the solar system
  scene.add(solarSystem); // Add the solar system to the scene
  const sun_radius = 5;
  const sphereGeometry = new THREE.SphereGeometry(sun_radius, 32, 32);
  const Planets = [];
  Planets.push(solarSystem) // Add the solar system to the planets array
  const textureLoader = new THREE.TextureLoader();
  const suntext = textureLoader.load('../Textures/8k_sun.jpg');
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: suntext,
  });

  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.name = 'Sun';
  const sun_scale = 30;
  sunMesh.scale.set(sun_scale, sun_scale, sun_scale);
  sunMesh.radius = sun_radius*sun_scale;


  solarSystem.add(sunMesh); // Add the sun mesh to the solar system
  Planets.push(sunMesh) // Add the sun mesh to the planets array
    
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

  // parameter "scene" is solarsystem so the planets will be added to the solar system in the scenegraph
  CreatePlanet (solarSystem, Planets, 15, 32, 'red', 0x112244, 300, 0, 0 , texture_venus);

  CreatePlanetAndMoon(solarSystem, Planets, 10, 32, 'blue', 0x112244, 400, -20 , 0, 0.5, 20, 0, 0, texture_makemake, texture_ceres);

  CreatePlanetAndMoon(solarSystem, Planets, 10, 32, 'yellow', 0x112244,-400, 0, 0, 1, 40, 0, 0, texture_Orc, texture_Orc);

  CreatePlanetAndMoon(solarSystem, Planets, 50, 32, 'orange', 0x112244, 0, 20, 500, 0.2, 80, 0, 0, texture_jup, texture_moon);

  CreatePlanet(solarSystem, Planets, 10, 32, 'pink', 0x112244, -600 , 10, 0, texture_taranis);
  
  CreatePlanet(solarSystem, Planets, 25, 32, 'purple', 0x112244, 0, -10, -500, texture_haumema);  

  const fifthPlanetOrbit = new THREE.Object3D();
  fifthPlanetOrbit.name = 'Saturn';
  fifthPlanetOrbit.position.set(-500, 50, 500);
  solarSystem.add(fifthPlanetOrbit);
  Planets.push(fifthPlanetOrbit)

  CreateRingedPlanet(fifthPlanetOrbit,Planets, 25 , 32 ,texture_saturn , texture_ring);
 

  const sixthPlanetOrbit = new THREE.Object3D();
  sixthPlanetOrbit.name = 'Saturn';
  sixthPlanetOrbit.position.set(500, 0, -500);
  solarSystem.add(sixthPlanetOrbit);
  Planets.push(sixthPlanetOrbit)

  CreateRingedPlanet(sixthPlanetOrbit,Planets, 25 , 32,texture_saturn , texture_ring);
   
  
  let station_obj2;
  console.log("station_obj2: prima del modello ",station_obj2)
  loadFbx(solarSystem).then(models => {
      station_obj2 = models.Station_fbx;

      Planets.push(models.rangeSphere)
   
  });

  
  Planets.forEach(planet => {
    console.log("planet in setup", planet)
  });


  return Planets;
}

