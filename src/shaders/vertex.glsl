
varying vec2 vUv;
varying vec2 vUv1;
varying vec3 vPosition;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;

void main() {
  vUv = uv;
  vec2 _uv = uv - 0.5;
  vUv1 = _uv;
  vUv1 *= uvRate1.xy;

  vUv1 += 0.5;



  // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  vec4 mvPosition = modelViewMatrix * vec4( position, 1. );
  gl_PointSize = 1000. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}