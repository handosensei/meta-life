import * as THREE from 'three';

export default class AmbientLightMaterial extends THREE.ShaderMaterial {
  constructor({ color = new THREE.Color('red') } = {}) {
    super({
      vertexShader: `
        uniform float scale;
        varying vec2 vUv;

        void main() {
          gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) + vec4(position.x * scale, position.y * scale, 0.0, 0.0));

          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;

        void main() {
            float dist = smoothstep(0.5, 0.0, length(vec2(0.5) - vUv));
            gl_FragColor = vec4(color, dist * 0.1);
        }
      `,
      uniforms: {
        color: { value: color },
        scale: { value: 1 },
      },
      depthTest: false,
      // blending: THREE.AdditiveBlending,
      transparent: true,
    });

    this.type = 'ParticlePointsMaterial';
    this.name = 'ParticlePointsMaterial';
  }
}
