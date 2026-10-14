import * as THREE from "three";

// Three intersecting orbital bands represent scientific, academic and entrepreneurial intelligence.
export function createGlobe() {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({
    color: 0x252525,
    metalness: 0.93,
    roughness: 0.22,
  });
  const silver = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 1,
    roughness: 0.2,
  });
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const orbit = new THREE.Group();
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.83 + i * 0.035, 0.13, 20, 160),
      i === 1 ? silver : metal,
    );
    const detail = new THREE.Mesh(
      new THREE.TorusGeometry(1.84 + i * 0.035, 0.017, 8, 160),
      silver,
    );
    detail.position.z = 0.132;
    orbit.add(torus, detail);
    orbit.rotation.set(
      (i * Math.PI) / 3 + 0.45,
      (i * Math.PI) / 3 + 0.2,
      i * 0.7,
    );
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 16, 16),
      silver,
    );
    marker.position.set(1.84 + i * 0.035, 0, 0);
    orbit.add(marker);
    group.add(orbit);
    rings.push(orbit);
  }
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.69, 1), metal);
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.73, 1)),
    new THREE.LineBasicMaterial({
      color: 0xc9c9c9,
      transparent: true,
      opacity: 0.65,
    }),
  );
  group.add(core, wire);
  return { group, rings, core, wire };
}
