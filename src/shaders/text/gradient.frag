uniform vec3 uColorStart;
uniform vec3 uColorEnd;
uniform float uOpacity;
uniform float uGradientDirection; // 0 = horizontal, 1 = vertical, 2 = diagonal

varying vec2 vUv;

void main() {
  float mixFactor;
  
  if (uGradientDirection < 0.5) {
    // Horizontal gradient
    mixFactor = vUv.x;
  } else if (uGradientDirection < 1.5) {
    // Vertical gradient
    mixFactor = vUv.y;
  } else {
    // Diagonal gradient
    mixFactor = (vUv.x + vUv.y) * 0.5;
  }
  
  vec3 color = mix(uColorStart, uColorEnd, mixFactor);
  gl_FragColor = vec4(color, uOpacity);
}