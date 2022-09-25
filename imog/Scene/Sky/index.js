import * as THREE from 'three';
import { Sky } from './SkyObject';
import IMOG from '~/lib/imog';


const v = new THREE.Vector3();

export default IMOG.Component('Sky', {
  options: {
    addTo: null,
  },

  props() {
    return {
      turbidity: 13,
      rayleigh: 2.7,
      mieCoefficient: 0.5,
      mieDirectionalG: 0.23,
      elevation: -18,
      azimuth: 0,

      sunPosition: (props) => {
        const phi = THREE.MathUtils.degToRad(90 - props.elevation);
        const theta = THREE.MathUtils.degToRad(props.azimuth);
        v.setFromSphericalCoords(1, phi, theta);
        return v.toArray();
      },
    };
  },

  async setup({ options }) {
    this.sky = new Sky();
    this.sky.scale.setScalar(100);
    if (options.addTo) options.addTo.add(this.sky);

    if (this.$gui) {
      const f = this.$gui.addFolder({
        title: 'Sky',
        expanded: false,
      });
      f.addInput(this.props, 'turbidity', { min: 0, max: 20, step: 0.1 });
      f.addInput(this.props, 'rayleigh', { min: 0, max: 4, step: 0.001 });
      // prettier-ignore
      f.addInput(this.props, 'mieCoefficient', { min: 0, max: 1, step: 0.001 });
      // prettier-ignore
      f.addInput(this.props, 'mieDirectionalG', { min: 0, max: 1, step: 0.001 });
      f.addInput(this.props, 'elevation', { min: -90, max: 90, step: 0.1 });
      f.addInput(this.props, 'azimuth', { min: -180, max: 180, step: 0.1 });

      f.addInput(this.sky.material.uniforms.tint, 'value', {
        label: 'tint',
      });
    }
  },

  hooks: {
    'set:turbidity'(v) {
      this.sky.material.uniforms.turbidity.value = v;
    },
    'set:rayleigh'(v) {
      this.sky.material.uniforms.rayleigh.value = v;
    },
    'set:mieCoefficient'(v) {
      this.sky.material.uniforms.mieCoefficient.value = v;
    },
    'set:mieDirectionalG'(v) {
      this.sky.material.uniforms.mieDirectionalG.value = v;
    },
    'set:sunPosition'(v) {
      this.sky.material.uniforms.sunPosition.value.fromArray(v);
    },
  },
});
