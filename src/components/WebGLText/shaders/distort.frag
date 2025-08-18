uniform vec3 uColor;
uniform float uTime;
uniform float uVelocity;

varying vec2 vUv;

void main() {
  // Add subtle color shift based on velocity
  vec3 color = uColor;
  
  // RGB shift effect based on velocity
  float shift = abs(uVelocity) * 0.002;
  color.r = uColor.r * (1.0 + shift);
  color.b = uColor.b * (1.0 - shift);
  
  gl_FragColor = vec4(color, 1.0);
}