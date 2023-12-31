import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { generateRandomMesh } from './meshgenerator';
import { gsap } from 'gsap';

const init = async () => {
  await document.body.classList.add('bgblack');
  await document.body.classList.remove('hidden');
  
  await new Promise(resolve => {
    setTimeout(() => {
      document.body.classList.add('bg');
      resolve();
    }, 3000);
  });
  
  await document.body.classList.remove('bgblack');
  await generateRandomMesh();
}
init();

const scene = new THREE.Scene();

const lights = [
  createLight(10, 0, -10, 0.4),
  createLight(0, 10, 10, 1),
  createLight(10, 0, 10, 1),
  createLight(0, -10, 10, 1),
  createLight(-10, 0, 10, 1),
];

function createLight(x, y, z, intensity = 1) {
  const light = new THREE.PointLight(0xffffff, intensity);
  light.position.set(x, y, z);
  scene.add(light);
  return light;
}

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 20;
camera.position.y = 5;
scene.add(camera);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(4);
renderer.setClearAlpha(1);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;

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

let touchDown = false;

window.addEventListener('touchstart', () => (touchDown = true));
window.addEventListener('touchend', () => (touchDown = false));
window.addEventListener('touchmove', (event) => {
  if (touchDown) {
    const touch = event.touches[0];
    rgb = [
      Math.round((touch.pageX / sizes.width) * 255),
      Math.round((touch.pageY / sizes.height) * 255),
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


const themeButton = document.querySelector('.theme');
const body = document.getElementsByTagName('body');
const a = document.getElementsByTagName('a');
const sunTheme = document.querySelector('.sunTheme');
themeButton.addEventListener('click', toggleTheme);

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function toggleTheme() {
  const startAlpha = renderer.getClearAlpha();
  const targetAlpha = startAlpha === 1 ? 0 : 1;
  const duration = 1000;

  let startTime = null;

  function animate(currentTime) {
    if (!startTime) startTime = currentTime;

    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easedProgress = easeInOutQuad(progress);

    const newAlpha = startAlpha + (targetAlpha - startAlpha) * easedProgress;
    renderer.setClearAlpha(newAlpha);

    updateColors(easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  function updateColors(progress) {
    const bodyColorStart = startAlpha === 1 ? '#F6F4EB' : '#FFDBC3';
    const bodyColorEnd = startAlpha === 1 ? '#FFDBC3' : '#F6F4EB';
    const sunThemeColorStart = startAlpha === 1 ? '#F0DE36' : '#FFDBC3';
    const sunThemeColorEnd = startAlpha === 1 ? '#FFDBC3' : '#F0DE36';

    const interpolatedBodyColor = interpolateColor(
      bodyColorStart,
      bodyColorEnd,
      progress
    );
    const interpolatedSunThemeColor = interpolateColor(
      sunThemeColorStart,
      sunThemeColorEnd,
      progress
    );

    document.body.style.color = interpolatedBodyColor;
    sunTheme.style.color = interpolatedSunThemeColor;

    for (const link of a) {
      link.style.color = interpolatedBodyColor;
    }
  }

  requestAnimationFrame(animate);
}

function interpolateColor(startColor, endColor, progress) {
  const startRGB = hexToRgb(startColor);
  const endRGB = hexToRgb(endColor);

  const interpolatedRGB = [];
  for (let i = 0; i < 3; i++) {
    interpolatedRGB[i] = Math.round(
      startRGB[i] + (endRGB[i] - startRGB[i]) * progress
    );
  }

  return `rgb(${interpolatedRGB.join(',')})`;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

const regenerateButton = document.querySelector('.regenerate');

regenerateButton.addEventListener('click', function () {
  regenerateButton.style.animation = 'none';
  void regenerateButton.offsetWidth;
  regenerateButton.style.animation = '';
});

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const numStars = 4444;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(numStars * 3);
const starColors = new Float32Array(numStars * 3);

const colorsArray = [
  '#C8AE7D',
  '#8CABFF',
  '#9F91CC',
  '#FFDBC3',
  '#F7E987',
  '#F7D060',
  '#F45050',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',

];

for (let i = 0; i < numStars; i++) {
  starPositions[i * 3] = getRandomInRange(-50, 50);
  starPositions[i * 3 + 1] = getRandomInRange(-50, 50);
  starPositions[i * 3 + 2] = getRandomInRange(-50, 50);

  const randomColor = new THREE.Color(
    colorsArray[Math.floor(Math.random() * colorsArray.length)]
  );
  starColors[i * 3] = randomColor.r;
  starColors[i * 3 + 1] = randomColor.g;
  starColors[i * 3 + 2] = randomColor.b;
}

starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(starPositions, 3)
);
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 0.1,
  vertexColors: THREE.VertexColors,
});

const starPoints = new THREE.Points(starGeometry, starMaterial);
scene.add(starPoints);

const starLoop = () => {
  controls.update();

  const positions = starGeometry.attributes.position.array;
  for (let i = 0; i < numStars; i++) {
    positions[i * 3 + 2] += 0.01;
    if (positions[i * 3 + 2] > 50) {
      positions[i * 3 + 2] = -50;
    }
  }
  starGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
  window.requestAnimationFrame(starLoop);
};
starLoop();

const musicIcon = document.querySelector('.musicIcon');
const backgroundMusic = document.getElementById('backgroundMusic');

let isMuted = true;

function toggleMusic() {
  if (isMuted) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }

  isMuted = !isMuted;
  updateMusicIcon();
}

function updateMusicIcon() {
  if (isMuted) {
    musicIcon.classList.add('muted');
    musicIcon.classList.add('strikethrough-diagonal');
  } else {
    musicIcon.classList.remove('muted');
    musicIcon.classList.remove('strikethrough-diagonal');
  }
}

musicIcon.addEventListener('click', toggleMusic);

updateMusicIcon();

