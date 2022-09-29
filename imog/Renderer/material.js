import * as THREE from 'three';
import fragmentShader from './fragment.glsl';
import IMOG from '~/lib/imog';

export default IMOG.Component('RendererMaterial', {
  options: {
    worldTarget: null,
    vfxTarget: null,
    vfxTargetBloom: null,
  },

  setup({ options }) {
    this.material = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            vUv = uv;
        }`,

      fragmentShader,
      uniforms: {
        tWorld: { value: options.worldTarget },
        tVfx: { value: options.vfxTarget },
        tVfxBloom: { value: options.vfxTargetBloom },
        levels: { value: new THREE.Vector3(1, 1, 1) },
        saturation: { value: 1 },
        resolution: { value: [2, 1] },
        uTime: { value: 0 },
      },
    });
  },
});
