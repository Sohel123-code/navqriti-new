import * as THREE from "three";

// A soft spring field: points repel, curl around the cursor and return home.
export function createDotGrid(width, height, material) {
  const spacing = width < 650 ? 27 : 24;
  const columns = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;
  const count = columns * rows;
  const positions = new Float32Array(count * 3);
  const origins = new Float32Array(count * 2);
  const velocities = new Float32Array(count * 2);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const jitterX = Math.sin(i * 13.37) * spacing * 0.32;
    const jitterY = Math.cos(i * 7.91) * spacing * 0.32;
    const x = (i % columns) * spacing + jitterX;
    const y = Math.floor(i / columns) * spacing + jitterY;
    origins.set([x, y], i * 2);
    positions.set([x, y, 0], i * 3);
    sizes[i] = 1.6 + (Math.sin(i * 3.7) + 1) * 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
  );
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  function update(delta, time, pointer, ripple) {
    const step = Math.min(delta * 60, 2);
    const drag = Math.pow(0.9, step);
    for (let i = 0; i < count; i++) {
      const p = i * 3;
      const v = i * 2;
      const x = positions[p];
      const y = positions[p + 1];
      const homeX = origins[v] + Math.sin(time * 0.36 + i) * 2.5;
      const homeY = origins[v + 1] + Math.cos(time * 0.28 + i * 0.7) * 2.5;
      let fx = (homeX - x) * 0.012;
      let fy = (homeY - y) * 0.012;

      if (pointer.active) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        if (distance < 235) {
          const force = (1 - distance / 235) ** 2 * 2.8;
          fx += (dx / distance - (dy / distance) * 0.38) * force;
          fy += (dy / distance + (dx / distance) * 0.38) * force;
          fx += pointer.vx * force * 0.025;
          fy += pointer.vy * force * 0.025;
        }
      }

      if (ripple.age < 1.2) {
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        const wave = Math.max(
          0,
          1 - Math.abs(distance - ripple.age * 420) / 55,
        );
        const force = wave * (1 - ripple.age / 1.2) * 3;
        fx += (dx / distance) * force;
        fy += (dy / distance) * force;
      }

      velocities[v] = THREE.MathUtils.clamp(
        (velocities[v] + fx * step) * drag,
        -12,
        12,
      );
      velocities[v + 1] = THREE.MathUtils.clamp(
        (velocities[v + 1] + fy * step) * drag,
        -12,
        12,
      );
      positions[p] += velocities[v] * step;
      positions[p + 1] += velocities[v + 1] * step;
    }
    geometry.attributes.position.needsUpdate = true;
  }

  return { points, update, dispose: () => geometry.dispose() };
}
