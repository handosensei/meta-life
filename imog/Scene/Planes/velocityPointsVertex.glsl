attribute float rand;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float time;
uniform float pointScale;
uniform float pr;

varying vec3 vColor;
varying float vAlpha;

#pragma glslify: snoise = require(glsl-noise/simplex/3d)

vec3 snoiseVec3( vec3 x ){

  float s  = snoise(vec3( x ));
  float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  vec3 c = vec3( s , s1 , s2 );
  return c;

}

vec3 curlNoise( vec3 p ){

  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );

}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

void main() {
    float tt = fract((time * 0.25 + rand));
    float displaceAmount = mix(20.0, 30.0, rand) * 0.25;
    // vec3 p = position + curlNoise(position * 1.0 + time * 0.1) * displaceAmount * tt;
    vec3 p = position + normalize(position) * displaceAmount * cubicOut(tt);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float r1 = fract((position.x + position.y + position.z) * 416.3716);
    gl_PointSize = mix(2.0, 8.0, r1) * pointScale / 2.5 * pr;

    float r2 = floor(fract((position.x + position.y + position.z) * 31.44387) * 3.0);
    vColor = r2 == 0.0 ? color1 / 255.0 : r2 == 1.0 ? color2 / 255.0 : color3 / 255.0;

    vAlpha = clamp(sin(tt * 3.14 * 2.0), 0.0, 1.0);
}
