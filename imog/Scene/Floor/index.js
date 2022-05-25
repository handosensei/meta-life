import * as THREE from 'three';
import IMOG from '~/lib/imog';

import FloorMeshStandardMaterial from './FloorMeshStandardMaterial';
const g = new THREE.PlaneBufferGeometry(1, 1);

export default IMOG.Component('Floor', {
  options: {
    addTo: null,
  },

  props() {
    return {
      size: 4,
    };
  },

  async setup({ options }) {
    this.material = new FloorMeshStandardMaterial({
      color: 0x292b33,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(g, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    if (options.addTo) options.addTo.add(this.mesh);
  },

  hooks: {
    'set:size'(v) {
      this.mesh.scale.setScalar(v);
    },
  },
});
