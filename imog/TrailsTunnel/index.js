import _ from 'underscore';
import * as THREE from 'three';
import Line from './Line';
import IMOG from '~/lib/imog';
import { map } from '~/lib/math';

export default IMOG.Component('TrailsTunnel', {
  options: {
    addTo: null,
    amount: 50,
    length: 200,
    radius: 30,
  },

  props() {
    return {
      active: true,
    };
  },

  async setup({ options }) {
    this.i = 0;

    this.group = new THREE.Group();
    this.group.rotation.z = Math.PI / 2;
    this.group.rotation.x = Math.PI / 2;

    this.group.name = 'TrailsTunnel';
    if (options.addTo) options.addTo.add(this.group);

    this.lines = _.range(options.amount).map(() => {
      const a = map(Math.random(), 0, 1, 0, Math.PI * 2);
      const r = map(Math.random(), 0, 1, options.radius * 0.5, options.radius);
      const line = new Line({
        position: new THREE.Vector3(map(Math.random(), 0, 1, -options.length / 2, options.length / 2), r * Math.sin(a), r * Math.cos(a)),
        tunnelLength: options.length,
      });
      this.group.add(line.mesh);
      return line;
    });
  },

  hooks: {
    'while:active'(dt) {
      this.i++;
      if (this.i % 2 !== 0) return;
      this.lines.forEach((line, i) => {
        line.tick(dt);
      });
    },
  },
});
