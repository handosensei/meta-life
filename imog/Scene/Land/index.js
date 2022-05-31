import * as THREE from 'three';
import IMOG from '~/lib/imog';
import _ from 'underscore';

import AmbientParticles from '~/imog/AmbientParticles';
import AmbientLight from '~/imog/AmbientLight';

import ThreadsMaterial from '~/imog/_Shared/ThreadsMaterial';
import PointsMaterial from '~/imog/_Shared/PointsMaterial';

export default IMOG.Component('Land', {
  options: {
    addTo: null,
    target: null,
  },

  props() {
    return {
      active: true,
      progress: 0,

      pr: (props, { context }) => context.$rendererProps.pr,
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

    this.groundGroup = new THREE.Group();
    this.groundGroup.scale.setScalar(1.15);
    this.groundGroup.position.y = -0.2;
    this.group.add(this.groundGroup);

    this.threads1 = this.group.getObjectByName('Tower_Threadexp');
    this.threads1.material = new ThreadsMaterial({
      depthTest: true,
      color: new THREE.Color(0, 0, 255),
      backFace: 0.5,
    });
    this.threads1.layers.enable(1);
    this.groundGroup.add(this.threads1);
    this.threads2 = this.group.getObjectByName('Tower_Thread2exp');
    this.threads2.material = new ThreadsMaterial({
      depthTest: true,
      color: new THREE.Color(129, 199, 255),
      backFace: 0.5,
    });
    this.threads2.layers.enable(1);
    this.groundGroup.add(this.threads2);

    (() => {
      const ref = this.group.getObjectByName('Tower_Particles');
      this.groundGroup.add(ref);
      ref.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0.02) });
      const geo = new THREE.BufferGeometry();
      const reps = 2;
      const newPositions = new Float32Array(ref.geometry.attributes.position.array.length * reps);
      _.times(reps, (i) => {
        newPositions.set(ref.geometry.attributes.position.array, i * ref.geometry.attributes.position.array.length);
      });
      geo.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));

      _.each(geo.attributes.position.array, (val, i) => {
        geo.attributes.position.array[i] = val + (Math.random() - 0.5) * 0.1;
      });

      const randVertices = new Float32Array(
        _.range(geo.attributes.position.count).map((i) => {
          return Math.random();
        })
      );
      geo.setAttribute('rand', new THREE.BufferAttribute(randVertices, 1));

      this.points = new THREE.Points(
        geo,
        new PointsMaterial({
          color1: new THREE.Color(0, 144, 129),
          color2: new THREE.Color(16 * 0.5, 16 * 0.5, 255 * 0.5),
          color3: new THREE.Color(11 * 0.5, 146 * 0.5, 255 * 0.5),
        })
      );
      this.points.material.uniforms.fogNear.value = 20;
      this.points.material.uniforms.fogFar.value = 50;
      this.points.material.uniforms.pointScale.value = 1;
      this.points.layers.enable(1);
      this.points.scale.copy(ref.scale);
      this.points.rotation.copy(ref.rotation);
      this.groundGroup.add(this.points);
    })();

    this.ground = this.group.getObjectByName('Ground');
    this.ground.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    this.groundGroup.add(this.ground);

    this.groundWire = this.group.getObjectByName('GroundWire');
    this.groundWire.material = new THREE.MeshBasicMaterial({
      color: 0x222266,
    });
    // this.groundWire.layers.enable(1);
    // this.groundGroup.add(this.groundWire);

    this.ambientParticles1 = new AmbientParticles({
      options: {
        addTo: this.groundGroup,
      },
      props: {
        position: { x: 0, y: -1, z: 0 },
        scale: 5,
      },
    });
    this.ambientParticles2 = new AmbientParticles({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: 0, y: 8, z: -8 },
        scale: 8,
      },
    });
    this.ambientParticles3 = new AmbientParticles({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: 0, y: 8, z: 8 },
        scale: 8,
      },
    });

    this.ambientLight1 = new AmbientLight({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: 6.9, y: -1.6, z: 0.9 },
        scale: 25,
        color: { r: 13, g: 13, b: 36 },
      },
    });

    if (this.$gui) {
      const f = this.$gui.addFolder({
        title: '#4 Land',
        expanded: false,
      });
      f.addInput(this.ambientLight1.props, 'color', {
        label: 'ambient 1 color',
      });
      f.addInput(this.ambientLight1.props, 'position', {
        label: 'ambient 1 pos',
      });
    }
  },

  hooks: {
    'set:progress'(v) {
      this.group.visible = v > 5.75;
    },
    'while:active'(dt) {
      this.groundGroup.rotation.y += 0.0001 * dt;
      this.points.material.uniforms.time.value += 0.0005 * dt;
    },

    'set:pr'(pr) {
      this.points.material.uniforms.pr.value = pr;
    },
  },
});
