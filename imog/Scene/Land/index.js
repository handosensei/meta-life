import * as THREE from 'three';
import IMOG from '~/lib/imog';
import _ from 'underscore';

export default IMOG.Component('Land', {
  options: {
    addTo: null,
    target: null,
  },

  props() {
    return {
      progress: 0,
    };
  },

  async setup({ options }) {
    this.group = new THREE.Group();
    this.group.name = 'Land';
    this.group.position.copy(options.target.position);
    this.group.rotation.copy(options.target.rotation);
    this.group.scale.copy(options.target.scale);
    options.target.parent.add(this.group);
    // options.target.parent.remove(options.target);
    options.target.position.set(0, 0, 0);
    options.target.rotation.set(0, 0, 0);
    options.target.scale.set(1, 1, 1);
    this.group.add(options.target);
  },

  hooks: {
    'set:progress'(v) {
      this.group.visible = v > 5.75;
    },
  },
});
