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

export function createPlanet(scene) {
    const SphereGeometry = new THREE.IcosahedronGeometry(50, 5);
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
}
 