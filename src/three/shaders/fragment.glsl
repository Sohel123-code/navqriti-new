varying float vAlpha;

void main() {
  float radius = length(gl_PointCoord - 0.5);
  float edge = 1.0 - smoothstep(0.32, 0.5, radius);
  if (edge < 0.01 || vAlpha < 0.01) discard;
  gl_FragColor = vec4(vec3(0.08), vAlpha * edge);
}
