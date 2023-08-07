import * as THREE from 'three';

export const generateRandomMesh = () => {
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  let meshArr = [
    new THREE.BoxGeometry(4, 4, 4),
    new THREE.BoxGeometry(5, 4, 4),
    new THREE.BoxGeometry(8, 4, 4),
    new THREE.BoxGeometry(8, 2, 2),
    new THREE.BoxGeometry(4, 4, 4),
    new THREE.BoxGeometry(5, 4, 4),
    new THREE.BoxGeometry(8, 4, 4),
    new THREE.BoxGeometry(10, 2, 2),
    new THREE.ConeGeometry(2, 4, 11),
    new THREE.ConeGeometry(2, 4, 18),
    new THREE.ConeGeometry(3, 5, 16),
    new THREE.IcosahedronGeometry(2, 0),
    new THREE.IcosahedronGeometry(3, 0),
    new THREE.IcosahedronGeometry(4, 0),
    new THREE.IcosahedronGeometry(2, 0),
    new THREE.IcosahedronGeometry(3, 0),
    new THREE.IcosahedronGeometry(4, 0),
    new THREE.OctahedronGeometry(1, 50),
    new THREE.OctahedronGeometry(1, 20),
    new THREE.OctahedronGeometry(2, 40),
    new THREE.OctahedronGeometry(2, 30),
    new THREE.OctahedronGeometry(3, 50),
    new THREE.OctahedronGeometry(3, 60),
    new THREE.OctahedronGeometry(1, 33),
    new THREE.OctahedronGeometry(2, 21),
    new THREE.OctahedronGeometry(3, 33),
    new THREE.SphereGeometry(2, 62, 62),
    new THREE.SphereGeometry(3, 64, 64),
    new THREE.SphereGeometry(3, 61, 61),
    new THREE.SphereGeometry(3, 59, 59),
    new THREE.SphereGeometry(3, 64, 64),
    new THREE.SphereGeometry(2, 65, 65),
    new THREE.SphereGeometry(3, 48, 48),
    new THREE.SphereGeometry(3, 53, 53),
    new THREE.SphereGeometry(3, 55, 55),
    new THREE.SphereGeometry(3, 57, 57),
    new THREE.TorusGeometry(2, 1, 12, 33),
    new THREE.TorusGeometry(2, 1, 28, 80),
    new THREE.TorusGeometry(2, 1, 36, 100),
    new THREE.TorusKnotGeometry(2, 0.4, 12, 14),
    new THREE.TorusKnotGeometry(2, 0.4, 16, 16),
    new THREE.TorusKnotGeometry(2, 0.4, 16, 24),
    new THREE.TorusGeometry(2, 1, 12, 33),
    new THREE.TorusGeometry(2, 1, 28, 80),
    new THREE.TorusGeometry(2, 1, 36, 100),
    new THREE.TorusKnotGeometry(2, 0.4, 12, 14),
    new THREE.TorusKnotGeometry(2, 0.4, 16, 16),
    new THREE.TorusKnotGeometry(2, 0.4, 16, 24),
  ];

  const geometry = meshArr[Math.floor(Math.random() * meshArr.length)];
  const material = new THREE.MeshStandardMaterial({
    color: `${getRandomColor()}`,
    roughness: 0.69,
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};
