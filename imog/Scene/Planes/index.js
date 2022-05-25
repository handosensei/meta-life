import * as THREE from 'three';
import IMOG from '~/lib/imog';
import _ from 'underscore';
import { map } from '~/lib/math';

import TrailsTunnel from '~/imog/TrailsTunnel';

import { SimplexNoise } from 'simplex-noise';
const simplex = new SimplexNoise();
const rand = (x, y) => simplex.noise2D(x, y);

const vec3 = new THREE.Vector3();

export default IMOG.Component('Planes', {
  options: {
    addTo: null,
    target: null,
  },

  props() {
    return {
      active: true,
      progress: 0,
    };
  },

  async setup({ options }) {
    this.group = new THREE.Group();
    this.group.name = 'Planes';
    this.group.position.copy(options.target.position);
    this.group.rotation.copy(options.target.rotation);
    this.group.scale.copy(options.target.scale);
    this.groupOrigin = this.group.position.clone();
    options.target.parent.add(this.group);
    // options.target.parent.remove(options.target);
    options.target.position.set(0, 0, 0);
    options.target.rotation.set(0, 0, 0);
    options.target.scale.set(1, 1, 1);
    this.group.add(options.target);

    this.planes = [...this.group.children[0].children];
    this.planes.forEach((plane, i) => {
      plane.origin = plane.position.clone();
    });

    this.trailsTunnel = new TrailsTunnel({
      options: {
        addTo: options.target.children[0],
      },
    });
  },

  hooks: {
    'set:progress'(v) {
      this.group.visible = v < 5.5 && v > 3.5;

      const originP = new THREE.Vector3(-2, 5, 18);
      const zeroP = new THREE.Vector3(0, 0, 0);
      if (v <= 4) {
        this.group.children[0].position.copy(originP);
      } else {
        this.group.children[0].position.copy(originP).lerp(zeroP, map(v, 4, 5, 0, 1));
      }
    },
    'while:active'() {
      const t = performance.now() * 0.05;
      this.planes.forEach((plane, i) => {
        plane.position.x = plane.origin.x + rand(t * 0.02, i) * 0.1;
        plane.position.y = plane.origin.y + rand(t * 0.02, i + 93.287) * 0.5;
        plane.position.z = plane.origin.z + rand(t * 0.02, i + 983782.28) * 0.1;
      });
    },
  },
});
