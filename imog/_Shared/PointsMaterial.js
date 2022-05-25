import * as THREE from 'three';

export default class PointsMaterial extends THREE.ShaderMaterial {
  constructor({ color1 = new THREE.Color('red'), color2 = new THREE.Color('blue'), color3 = new THREE.Color('white') } = {}) {
    super({
      vertexShader: `
        attribute float rand;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float time;
        uniform float pointScale;
        uniform float pr;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vFogDepth;

        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            float r1 = fract((position.x + position.y + position.z) * 416.3716);
            gl_PointSize = mix(2.0, 8.0, r1) * pointScale / 2.5 * pr;

            float r2 = floor(fract((position.x + position.y + position.z) * 31.44387) * 3.0);
            vColor = r2 == 0.0 ? color1 / 255.0 : r2 == 1.0 ? color2 / 255.0 : color3 / 255.0;

            vAlpha = sin(rand * 3.14 * 2.0 + time);

            vFogDepth = - mvPosition.z;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vFogDepth;
        uniform float fogNear;
        uniform float fogFar;

        void main() {
            float dist = length(vec2(0.5) - gl_PointCoord.xy);
            dist = step(dist, 0.5);
            float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );

            gl_FragColor = vec4(vColor, dist * vAlpha * (1.0 - fogFactor));
        }
      `,
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 },
        color3: { value: color3 },
        time: { value: 0 },
        fogNear: { value: 12 },
        fogFar: { value: 15 },
        pointScale: { value: 1 },
        pr: { value: 2.5 },
      },
      depthTest: false,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    this.type = 'CustomPointsMaterial';
    this.name = 'CustomPointsMaterial';
  }
}
