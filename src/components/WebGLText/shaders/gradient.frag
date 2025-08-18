uniform vec3 uGradientColor1;
uniform vec3 uGradientColor2;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Animated gradient
  float gradientFactor = vUv.y + sin(vUv.x * 2.0 + uTime * 0.5) * 0.1;
  
  // Mix between the two gradient colors
  vec3 color = mix(uGradientColor1, uGradientColor2, gradientFactor);
  
  gl_FragColor = vec4(color, 1.0);
}