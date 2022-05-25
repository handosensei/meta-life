import * as THREE from 'three';

export default class SphereThreadsMaterial extends THREE.ShaderMaterial {
  constructor({ color = new THREE.Color('red') } = {}) {
    super({
      vertexShader: `
        varying vec3 vNN;
        varying vec3 vEye;

        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            vec3 n = normalMatrix * normal;
            mat4 LM = modelMatrix;
            LM[2][3] = 0.0;
            LM[3][0] = 0.0;
            LM[3][1] = 0.0;
            LM[3][2] = 0.0;
            vec4 GN = LM * vec4(normal.xyz, 1.0);
            vNN = normalize(GN.xyz);
            vEye = normalize(GN.xyz-cameraPosition);

        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec3 vNN;
        varying vec3 vEye;

        void main() {
            float fresnelTerm = abs(dot(vEye, normalize(vNN) ));
            fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
            fresnelTerm = clamp(pow(fresnelTerm, 2.5), 0.02, 1.0);
            vec4 worldColor = vec4(color/255.0 * fresnelTerm, 1.0);
            gl_FragColor = worldColor;
            gl_FragColor.rgb = vec3(vEye);
            // gl_FragColor.rgb = vec3(fresnelTerm);
            // if (fresnelTerm < 0.0) discard;
        }
      `,
      uniforms: {
        color: { value: color },
      },
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.type = 'SphereThreadsMaterial';
    this.name = 'SphereThreadsMaterial';
  }
}
