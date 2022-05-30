import * as THREE from 'three';
import vertexShader from './velocityPointsVertex.glsl';

export default class VelocityPointsMaterial extends THREE.ShaderMaterial {
  constructor({ color1 = new THREE.Color('red'), color2 = new THREE.Color('blue'), color3 = new THREE.Color('white') } = {}) {
    super({
      vertexShader,
      fragmentShader: `
        uniform float alpha;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            gl_FragColor = vec4(vColor, vAlpha * alpha);
        }
      `,
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 },
        color3: { value: color3 },
        time: { value: 0 },
        alpha: { value: 1 },
        pointScale: { value: 1 },
        pr: { value: 2.5 },
      },
      depthTest: false,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    this.type = 'VelocityPointsMaterial';
    this.name = 'VelocityPointsMaterial';
  }
}
