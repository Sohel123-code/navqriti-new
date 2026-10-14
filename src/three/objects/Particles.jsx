import * as THREE from "three";

export function createParticles(count = 180) {
  const positions = new Float32Array(count * 3);
  // Deterministic spherical distribution: no flicker on remount.
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const radius = 2.45 + (Math.sin(i * 13.37) + 1) * 0.6;
    positions.set(
      [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      ],
      i * 3,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x242424,
      size: 0.027,
      transparent: true,
      opacity: 0.48,
      sizeAttenuation: true,
    }),
  );
  return points;
}
