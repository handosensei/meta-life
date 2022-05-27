import * as THREE from 'three';
import vertexShader from './pointsVertex.glsl';

export default class PointsMaterial extends THREE.ShaderMaterial {
  constructor({ color1 = new THREE.Color('red'), color2 = new THREE.Color('blue'), color3 = new THREE.Color('white') } = {}) {
    super({
      vertexShader,
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
