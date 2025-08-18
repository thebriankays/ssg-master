uniform vec3 uColor;
uniform float uOpacity;
uniform float uTime;

varying vec2 vUv;

void main() {
  // Animated color shift
  vec3 color = uColor;
  color.r += sin(uTime * 2.0) * 0.1;
  color.g += sin(uTime * 3.0) * 0.1;
  color.b += sin(uTime * 4.0) * 0.1;
  
  gl_FragColor = vec4(color, uOpacity);
}