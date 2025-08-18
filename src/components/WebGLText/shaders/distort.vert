uniform float uTime;
uniform float uDistortionAmount;
uniform float uDistortionSpeed;
uniform float uVelocity;

varying vec2 vUv;

void main() {
  vUv = uv;
  
  vec3 transformedPosition = position;
  
  // Add wave distortion based on time and velocity
  float wave = sin(position.x * 0.01 + uTime * uDistortionSpeed) * uDistortionAmount;
  float velocityEffect = uVelocity * 0.1;
  
  transformedPosition.y += wave * (1.0 + velocityEffect);
  transformedPosition.x += sin(position.y * 0.01 + uTime * uDistortionSpeed * 0.8) * uDistortionAmount * 0.5;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0);
}