import { ShaderLib, ShaderMaterial, UniformsLib, UniformsUtils, Vector2 } from 'three';

import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

UniformsLib.line = {
  worldUnits: { value: 1 },
  linewidth: { value: 1 },
  resolution: { value: new Vector2(1, 1) },
  dashOffset: { value: 0 },
  dashScale: { value: 1 },
  dashSize: { value: 1 },
  gapSize: { value: 1 }, // todo FIX - maybe change to totalSize
};

// ShaderLib['line'] = {
//   uniforms: UniformsUtils.merge([
//     UniformsLib.common,
//     UniformsLib.fog,
//     UniformsLib.line,
//   ]),
//
//   vertexShader,
//   fragmentShader,
// };
class CustomLineMaterial extends ShaderMaterial {
  constructor(parameters) {
    super({
      type: 'CustomLineMaterial',

      uniforms: {
        ...UniformsUtils.clone(ShaderLib.line.uniforms),
        fogNear: { value: 12 },
        fogFar: { value: 14 },
      },

      vertexShader,
      fragmentShader,

      clipping: true, // required for clipping support
    });

    this.isLineMaterial = false;
    this.transparent = true;

    Object.defineProperties(this, {
      color: {
        enumerable: true,

        get() {
          return this.uniforms.diffuse.value;
        },

        set(value) {
          this.uniforms.diffuse.value = value;
        },
      },

      worldUnits: {
        enumerable: true,

        get() {
          return 'WORLD_UNITS' in this.defines;
        },

        set(value) {
          if (value === true) {
            this.defines.WORLD_UNITS = '';
          } else {
            delete this.defines.WORLD_UNITS;
          }
        },
      },

      linewidth: {
        enumerable: true,

        get() {
          return this.uniforms.linewidth.value;
        },

        set(value) {
          this.uniforms.linewidth.value = value;
        },
      },

      dashed: {
        enumerable: true,

        get() {
          return Boolean('USE_DASH' in this.defines);
        },

        set(value) {
          if (Boolean(value) !== Boolean('USE_DASH' in this.defines)) {
            this.needsUpdate = true;
          }

          if (value === true) {
            this.defines.USE_DASH = '';
          } else {
            delete this.defines.USE_DASH;
          }
        },
      },

      dashScale: {
        enumerable: true,

        get() {
          return this.uniforms.dashScale.value;
        },

        set(value) {
          this.uniforms.dashScale.value = value;
        },
      },

      dashSize: {
        enumerable: true,

        get() {
          return this.uniforms.dashSize.value;
        },

        set(value) {
          this.uniforms.dashSize.value = value;
        },
      },

      dashOffset: {
        enumerable: true,

        get() {
          return this.uniforms.dashOffset.value;
        },

        set(value) {
          this.uniforms.dashOffset.value = value;
        },
      },

      gapSize: {
        enumerable: true,

        get() {
          return this.uniforms.gapSize.value;
        },

        set(value) {
          this.uniforms.gapSize.value = value;
        },
      },

      opacity: {
        enumerable: true,

        get() {
          return this.uniforms.opacity.value;
        },

        set(value) {
          this.uniforms.opacity.value = value;
        },
      },

      resolution: {
        enumerable: true,

        get() {
          return this.uniforms.resolution.value;
        },

        set(value) {
          this.uniforms.resolution.value.copy(value);
        },
      },

      alphaToCoverage: {
        enumerable: true,

        get() {
          return Boolean('USE_ALPHA_TO_COVERAGE' in this.defines);
        },

        set(value) {
          if (Boolean(value) !== Boolean('USE_ALPHA_TO_COVERAGE' in this.defines)) {
            this.needsUpdate = true;
          }

          if (value === true) {
            this.defines.USE_ALPHA_TO_COVERAGE = '';
            this.extensions.derivatives = true;
          } else {
            delete this.defines.USE_ALPHA_TO_COVERAGE;
            this.extensions.derivatives = false;
          }
        },
      },
    });

    this.setValues(parameters);
  }
}

export { CustomLineMaterial };
