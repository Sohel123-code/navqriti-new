import * as THREE from "three";

export function createNetwork() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.3,
  });
  const geometry = new THREE.BoxGeometry(0.09, 0.09, 0.09);
  const nodes = [];
  for (let i = 0; i < 30; i++) {
    const angle = i * 2.39996;
    const radius = 2.3 + (i % 5) * 0.12;
    const mesh = new THREE.Mesh(geometry, material);
    const scatter = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      Math.sin(i * 3.1) * 1.3,
    );
    const structured = new THREE.Vector3(
      ((i % 3) - 1) * 0.34,
      ((Math.floor(i / 3) % 3) - 1) * 0.34,
      (Math.floor(i / 9) - 1.2) * 0.34,
    );
    const deploy = new THREE.Vector3(
      Math.cos(angle) * 2.25,
      Math.sin(angle) * 0.8,
      Math.sin(angle) * 2.25,
    );
    mesh.position.copy(scatter);
    group.add(mesh);
    nodes.push({ mesh, positions: [scatter, structured, deploy] });
  }
  return { group, nodes };
}
