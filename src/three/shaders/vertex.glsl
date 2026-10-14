attribute float aSize;
uniform float uPixelRatio;
uniform vec2 uPointer;
uniform float uHover;
varying float vAlpha;

void main() {
  float focus = 1.0 - smoothstep(100.0, 330.0, distance(position.xy, uPointer));
  vAlpha = 0.12 + focus * uHover * 0.5;
  gl_PointSize = aSize * uPixelRatio * (1.0 + focus * uHover * 0.6);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
