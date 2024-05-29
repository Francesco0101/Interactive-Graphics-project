import * as THREE from 'three';

// Crea la scena
const scene = new THREE.Scene();

// Crea una camera
const camera_param = {
    fov: 75,
    width: 1024,
    height: 720,
    near: 0.1,
    far: 1000
    };

const camera = new THREE.PerspectiveCamera(camera_param.fov, camera_param.width/camera_param.height , camera_param.near, camera_param.far);
camera.position.z = 5;

// Crea il renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(camera_param.width, camera_param.height);
document.body.appendChild(renderer.domElement);

// Crea la geometria del cubo
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 'blue'})

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Funzione di animazione
function animate() {
  requestAnimationFrame(animate);

  // Ruota il cubo

  cube.rotation.z += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.x += 0.01;

  renderer.render(scene, camera);
}

animate();
