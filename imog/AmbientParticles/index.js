import * as THREE from 'three';
import IMOG from '~/lib/imog';
import _ from 'underscore';

import Material from './ParticlePointsMaterial';

export default IMOG.Component('AmbientParticles', {
  options: {
    addTo: null,
  },

  props() {
    return {
      active: true,
      position: { x: 0, y: 0, z: 0 },
      positionComputed: (props) => ({ ...props.position }),
      scale: 1,
    };
  },

  setup({ options }) {
    this.group = new THREE.Group();
    this.group.name = 'AmbientParticles';
    if (options.addTo) options.addTo.add(this.group);

    const pointsGeometry = new THREE.BufferGeometry();
    const pointsAmount = 750;
    const pointsVertices = new Float32Array(
      _.flatten(
        _.range(pointsAmount).map((i) => {
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          const r = Math.cbrt(Math.random());
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);
          const x = r * sinPhi * cosTheta;
          const y = r * sinPhi * sinTheta;
          const z = r * cosPhi;
          return [x, y, z];
        })
      )
    );
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsVertices, 3));

    const randVertices = new Float32Array(
      _.range(pointsAmount).map((i) => {
        return Math.random();
      })
    );
    pointsGeometry.setAttribute('rand', new THREE.BufferAttribute(randVertices, 1));

    const alpha = 0.75;
    this.points = new THREE.Points(
      pointsGeometry,
      new Material({
        color1: new THREE.Color(16 * alpha, 144 * alpha, 255 * alpha),
        color2: new THREE.Color(16 * 0.25, 16 * alpha, 255 * alpha),
        color3: new THREE.Color(16 * alpha, 144 * alpha, 255 * alpha),
      })
    );
    this.points.layers.enable(1);
    this.group.add(this.points);

    // this.helper = new THREE.Mesh(
    //   new THREE.BoxBufferGeometry(0.05, 0.05, 0.05),
    //   new THREE.MeshBasicMaterial({ color: 'red' })
    // );
    // this.group.add(this.helper);
  },

  hooks: {
    'while:active'(dt) {
      this.points.material.uniforms.time.value += 0.001 * dt;
    },
    'set:positionComputed'({ x, y, z }) {
      this.group.position.set(x, y, z);
    },
    'set:scale'(s) {
      this.group.scale.setScalar(s);
    },
  },
});
