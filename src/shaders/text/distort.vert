uniform float uTime;
uniform float uDistortionAmount;
uniform float uDistortionFrequency;

varying vec2 vUv;

void main() {
  vUv = uv;
  
  vec3 transformedPosition = position;
  
  // Wave distortion
  float wave = sin(position.y * uDistortionFrequency + uTime) * uDistortionAmount;
  transformedPosition.x += wave;
  
  // Slight vertical wave
  float verticalWave = sin(position.x * uDistortionFrequency * 0.5 + uTime * 1.5) * uDistortionAmount * 0.3;
  transformedPosition.y += verticalWave;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0);
}