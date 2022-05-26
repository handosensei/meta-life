import * as THREE from 'three';
import IMOG from '~/lib/imog';
import _ from 'underscore';

import AmbientParticles from '~/imog/AmbientParticles';
import AmbientLight from '~/imog/AmbientLight';

import useMouse from '~/lib/imog/use/mouse';
import useSpring from '~/lib/imog/use/spring';

import ThreadsMaterial from '~/imog/_Shared/ThreadsMaterial';
import PointsMaterial from '~/imog/_Shared/PointsMaterial';

export default IMOG.Component('Coins', {
  options: {
    addTo: null,
    target: null,
  },

  props() {
    return {
      active: true,
      progress: 0,

      pr: (props, { context }) => context.$rendererProps.pr,

      mouse: useMouse({ normalized: true }),
      mouseX: useSpring({
        target: (props) => -props.mouse.x,
        friction: 0.1,
      }),
      mouseY: useSpring({
        target: (props) => -props.mouse.y,
        friction: 0.1,
      }),
    };
  },

  async setup({ options }) {
    this.group = new THREE.Group();
    this.group.name = 'Coins';
    this.group.position.copy(options.target.position);
    this.group.rotation.copy(options.target.rotation);
    this.group.scale.copy(options.target.scale);
    options.target.parent.add(this.group);
    // options.target.parent.remove(options.target);
    options.target.position.set(0, 0, 0);
    options.target.rotation.set(0, 0, 0);
    options.target.scale.set(1, 1, 1);
    this.group.add(options.target);

    this.group.traverse((obj) => {
      if (obj.isMesh && obj.name.match('Thread')) {
        obj.material = new ThreadsMaterial({
          color: new THREE.Color(0, 0, 255),
        });
        obj.layers.enable(1);
        const clone = obj.clone();
        clone.material = new ThreadsMaterial({
          color: new THREE.Color(129, 199, 255),
        });
        // clone.geometry = clone.geometry.clone();
        clone.scale.set(-1, 1, 1);
        obj.parent.add(clone);
      }

      if (obj.isMesh && obj.name.match('Fill')) {
        obj.visible = false;
      }
    });

    this.coinBig = this.group.getObjectByName('CoinBig');
    this.coinBig.rOrigin = this.coinBig.rotation.clone();
    this.coinSmall = this.group.getObjectByName('CoinSmall');
    this.coinSmall.rOrigin = this.coinSmall.rotation.clone();

    const coinBigParticlesRef = this.group.getObjectByName('CoinMeshparticles');
    const coinSmallParticlesRef = this.group.getObjectByName('CoinSmall_Meshparticles');

    this.points = [];
    [coinBigParticlesRef, coinSmallParticlesRef].forEach((ref, i) => {
      const geo = new THREE.BufferGeometry();
      const reps = i === 0 ? 2 : 3;
      const newPositions = new Float32Array(ref.geometry.attributes.position.array.length * reps);
      _.times(reps, (i) => {
        newPositions.set(ref.geometry.attributes.position.array, i * ref.geometry.attributes.position.array.length);
      });
      geo.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));

      _.each(geo.attributes.position.array, (val, i) => {
        geo.attributes.position.array[i] = val + (Math.random() - 0.5) * 0.15;
      });

      const randVertices = new Float32Array(
        _.range(geo.attributes.position.count).map((i) => {
          return Math.random();
        })
      );
      geo.setAttribute('rand', new THREE.BufferAttribute(randVertices, 1));

      const points = new THREE.Points(
        geo,
        new PointsMaterial({
          color1: new THREE.Color(0, 144, 129),
          color2: new THREE.Color(16 * 0.5, 16 * 0.5, 255 * 0.5),
          color3: new THREE.Color(11 * 0.5, 146 * 0.5, 255 * 0.5),
        })
      );
      points.material.uniforms.fogFar.value = 999;
      points.layers.enable(1);
      ref.parent.add(points);
      ref.parent.remove(ref);
      this.points.push(points);
    });

    this.ambientParticles1 = new AmbientParticles({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: -2.5, y: 1.4, z: 0 },
        scale: 3,
      },
    });
    this.ambientParticles2 = new AmbientParticles({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: 2.5, y: -1.4, z: 0 },
        scale: 4,
      },
    });

    this.ambientLight1 = new AmbientLight({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: 1.4, y: 3.7, z: 5 },
        scale: 7,
        color: { r: 13, g: 13, b: 36 },
      },
    });
    this.ambientLight2 = new AmbientLight({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: 6.6, y: -3.4, z: 3.6 },
        scale: 20,
        color: { r: 3, g: 18, b: 19 },
      },
    });

    if (this.$gui) {
      const f = this.$gui.addFolder({
        title: '#3 Coins',
        expanded: false,
      });
      f.addInput(this.ambientLight1.props, 'color', {
        label: 'ambient 1 color',
      });
      f.addInput(this.ambientLight1.props, 'position', {
        label: 'ambient 1 pos',
      });
      f.addInput(this.ambientLight2.props, 'color', {
        label: 'ambient 2 color',
      });
      f.addInput(this.ambientLight2.props, 'position', {
        label: 'ambient 2 pos',
      });
    }
  },

  hooks: {
    'set:progress'(v) {},
    'while:active'(dt) {
      this.points.forEach((points, i) => {
        points.material.uniforms.time.value += 0.0005 * dt;
      });

      this.coinBig.children.forEach((child, i) => {
        child.rotation.y -= 0.00005 * dt * Math.sign(i - 0.5);
      });
      this.coinSmall.children.forEach((child, i) => {
        child.rotation.y -= 0.00005 * dt * Math.sign(i - 0.5);
      });

      this.coinBig.rotation.copy(this.coinBig.rOrigin);
      this.coinBig.rotation.y += this.props.mouseX.value * 0.5;
      this.coinBig.rotation.x += -this.props.mouseY.value * 0.5;
      this.coinSmall.rotation.copy(this.coinSmall.rOrigin);
      this.coinSmall.rotation.y -= this.props.mouseX.value * 1;
      this.coinSmall.rotation.x -= -this.props.mouseY.value * 1;
    },
    'set:pr'(pr) {
      this.points.forEach((points, i) => {
        points.material.uniforms.pr.value = pr;
      });
    },
  },
});
