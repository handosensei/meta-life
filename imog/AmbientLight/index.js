import * as THREE from 'three';
import _ from 'underscore';

import Material from './AmbientLightMaterial';
import IMOG from '~/lib/imog';

export default IMOG.Component('AmbientLight', {
  options: {
    addTo: null,
  },

  props() {
    return {
      position: { x: 0, y: 0, z: 0 },
      positionComputed: (props) => ({ ...props.position }),
      scale: 1,
      color: { r: 255, g: 255, b: 255 },
      colorComputed: (props) => ({ ...props.color }),
    };
  },

  setup({ options }) {
    this.group = new THREE.Group();
    this.group.name = 'AmbientParticles';
    if (options.addTo) options.addTo.add(this.group);

    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new Material());
    this.quad.frustumCulled = false;
    this.group.add(this.quad);
  },

  hooks: {
    'set:positionComputed'({ x, y, z }) {
      this.group.position.set(x, y, z);
    },
    'set:scale'(s) {
      this.quad.material.uniforms.scale.value = s;
    },
    'set:colorComputed'({ r, g, b }) {
      this.quad.material.uniforms.color.value.r = r / 255;
      this.quad.material.uniforms.color.value.g = g / 255;
      this.quad.material.uniforms.color.value.b = b / 255;
    },
  },
});
