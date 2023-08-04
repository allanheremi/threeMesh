import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

function getRandomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function generateRandomMesh() {
  const randomColor = getRandomColor();

  let meshArr = [
    new THREE.SphereGeometry(3, 64, 64),
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.ConeGeometry(3, 5, 16),
    new THREE.CylinderGeometry(1, 1, 5, 6),
    new THREE.TorusGeometry(2, 1, 36, 100),
    new THREE.TorusKnotGeometry(2, 0.4, 16, 16),
    
    new THREE.SphereGeometry(2, 62, 62),
    new THREE.BoxGeometry(4, 4, 4),
    new THREE.ConeGeometry(2, 4, 18),
    new THREE.CylinderGeometry(1, 1, 5, 4),
    new THREE.TorusGeometry(2, 1, 28, 80),
    new THREE.TorusKnotGeometry(2, 0.4, 16, 24),
    
    new THREE.SphereGeometry(3, 64, 64),
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.ConeGeometry(2, 4, 11),
    new THREE.TorusGeometry(2, 1, 12, 33),
    new THREE.TorusKnotGeometry(2, 0.4, 12, 14),
    
 
    
    
  ];

  const geometry = meshArr[Math.floor(Math.random() * meshArr.length)];
  const material = new THREE.MeshStandardMaterial({
    color: `#${randomColor}`,
    roughness: 0.69,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

const scene = new THREE.Scene();
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 0, -10);
light.intensity = 1.25;
scene.add(light);

const light1 = new THREE.PointLight(0xffffff, 1);
light1.position.set(0, 10, 10);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 1);
light2.position.set(10, 0, 10);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 1);
light3.position.set(0, -10, 10);
scene.add(light3);

const light4 = new THREE.PointLight(0xffffff, 1);
light4.position.set(-10, 0, 10);
scene.add(light4);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 18;

scene.add(camera);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

function generateAndReplaceMesh() {
  const newMesh = generateRandomMesh();
  scene.remove(mesh);
  mesh = newMesh;
  scene.add(mesh);
}

let mesh = generateRandomMesh();
scene.add(mesh);

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));
window.addEventListener('mousemove', e => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    const newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

const titleButton = document.querySelector('.titleButton');
titleButton.addEventListener('click', generateAndReplaceMesh);
