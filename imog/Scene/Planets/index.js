import * as THREE from 'three';
import IMOG from '~/lib/imog';
import loadGLTF from '~/lib/three/loadGLTF';
import _ from 'underscore';
import { map } from '~/lib/math';

import TrailsBoid from '~/imog/TrailsBoid';
import AmbientParticles from '~/imog/AmbientParticles';
import AmbientLight from '~/imog/AmbientLight';

import ThreadsMaterial from '~/imog/_Shared/ThreadsMaterial';
import PointsMaterial from '~/imog/_Shared/PointsMaterial';

export default IMOG.Component('Planets', {
  options: {
    addTo: null,
    target: null,
  },

  props() {
    return {
      sceneActive: true,
      target: 0,
      progress: 0,
      active: (props) => props.sceneActive && props.progress >= 0 && props.progress <= 4,
      pr: (props, { context }) => context.$rendererProps.pr,
    };
  },

  async setup({ options }) {
    this.group = new THREE.Group();
    this.group.name = 'Planets';
    this.group.position.copy(options.target.position);
    this.group.rotation.copy(options.target.rotation);
    this.group.scale.copy(options.target.scale);
    options.target.parent.add(this.group);

    this.group.add(options.target);
    this.group.traverse((obj) => {
      if (obj.isMesh && obj.name.match('Threads')) {
        this.sphere1 = obj;
        obj.material = new ThreadsMaterial({
          color: new THREE.Color(0, 0, 255),
          backFace: 0.1,
        });
        obj.layers.enable(1);
        const clone = obj.clone();
        this.sphere2 = clone;
        clone.material = new ThreadsMaterial({
          color: new THREE.Color(129 * 0.5, 199 * 0.5, 255 * 0.5),
          backFace: 0.1,
        });
        // clone.geometry = clone.geometry.clone();
        clone.scale.set(-1, 1, 1);
        obj.parent.add(clone);
      }
    });
    this.spheres = [this.sphere1, this.sphere2];

    this.boildThreadsColor1 = new THREE.Color(11, 140, 255);
    this.boildThreadsColor2 = new THREE.Color(11, 11, 255);

    this.trails = new TrailsBoid({
      options: {
        addTo: this.group,
        color1: this.boildThreadsColor1,
        color2: this.boildThreadsColor2,
      },
      props: {
        active: (props) => this.props.active && this.props.progress > 0 && this.props.progress < 3.5,
      },
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
        position: { x: -3, y: 1.4, z: -1 },
        scale: 7,
        color: { r: 13, g: 13, b: 36 },
      },
    });
    this.ambientLight2 = new AmbientLight({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: 3.5, y: -1.2, z: 0 },
        scale: 10,
        color: { r: 5 * 0.5, g: 36 * 0.5, b: 37 * 0.5 },
      },
    });

    this.spheresMaterial = new ThreadsMaterial({
      color: new THREE.Color(25, 25, 255),
      backFace: 0.1,
    });
    this.spheresMaterial2 = new ThreadsMaterial({
      color: new THREE.Color(177, 177, 255),
      backFace: 0.1,
    });

    this.sphereSmall1 = this.group.getObjectByName('SphereSmall1');
    this.sphereSmall2 = this.group.getObjectByName('SphereSmall2');
    this.smallSpheres = [this.sphereSmall1, this.sphereSmall2];

    this.smallSpheres.forEach((obj, i) => {
      obj.material = this.spheresMaterial;
      obj.origin = obj.position.clone();
      obj.morphTargetInfluences[0] = -1;
      const clone = obj.clone();
      clone.material = this.spheresMaterial2;
      clone.rotation.x = Math.PI / 2;
      clone.origin = obj.position.clone();
      obj.parent.add(clone);
      this.smallSpheres.push(clone);
    });

    const pointsGeometry = new THREE.BufferGeometry();
    const pointsAmount = 3000;
    const pointsVertices = new Float32Array(
      _.flatten(
        _.range(pointsAmount).map((i) => {
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          const r = 1 + Math.random() * 0.1;
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

    this.points = new THREE.Points(
      pointsGeometry,
      new PointsMaterial({
        color1: new THREE.Color(0, 144, 129),
        color2: new THREE.Color(16, 16, 255),
        color3: new THREE.Color(11, 146, 255),
      })
    );
    this.points.layers.enable(1);
    this.group.add(this.points);

    if (this.$gui) {
      const f = this.$gui.addFolder({
        title: '#1 Planets',
        expanded: false,
      });
      // f.addInput(this.sphere1.material.uniforms.color, 'value', {
      //   label: 'sphere 1 color',
      // });
      // f.addInput(this.sphere2.material.uniforms.color, 'value', {
      //   label: 'sphere 2 color',
      // });
      f.addInput(this.points.material.uniforms.color1, 'value', {
        label: 'points color 1',
      });
      f.addInput(this.points.material.uniforms.color2, 'value', {
        label: 'points color 2',
      });
      f.addInput(this.points.material.uniforms.color3, 'value', {
        label: 'points color 3',
      });
      f.addInput(this, 'boildThreadsColor1', {
        label: 'boids color 1',
      });
      f.addInput(this, 'boildThreadsColor2', {
        label: 'boids color 2',
      });

      f.addInput(this.ambientLight1.props, 'color', {
        label: 'ambient 1 color',
      });
      f.addInput(this.ambientLight2.props, 'color', {
        label: 'ambient 2 color',
      });
    }
  },

  hooks: {
    'set:progress'(v) {
      this.group.visible = v < 4.5;
      this.spheres.forEach((obj, i) => {
        obj.morphTargetInfluences[0] = map(v, 1, 2, 0.25, -0.75, true);
      });

      this.smallSpheres.forEach((obj, i) => {
        obj.visible = v > 2;
        if (obj.visible) {
          obj.position.set(0, 0, 0).lerp(obj.origin, map(v, 2.5, 3, 0.75, 1, true));
          obj.material.uniforms.alpha.value = map(v, 2.5, 3, 0, 1, true);
        }
      });

      this.spheresTransitionR = map(v, 0, 1, 0, -1, true) + map(v, 1, 2, 0, -5, true) + map(v, 2, 3, 0, -3, true) + map(v, 3, 4, 0, -20, true);

      this.points.material.uniforms.pointScale.value = map(v, 1, 2, 1, 1, true);
    },
    'while:active'(dt) {
      this.points.material.uniforms.time.value += 0.0005 * dt;
      // this.points.rotation.y += 0.00002 * dt;
      // this.sphere1.rotation.y += 0.00002 * dt;
      // this.sphere2.rotation.y += 0.00005 * dt;

      this.points.rotation.y = this.spheresTransitionR * 0.2;
      this.sphere1.rotation.y = this.spheresTransitionR;
      this.sphere2.rotation.y = this.spheresTransitionR * 0.5;
    },
    'set:pr'(pr) {
      this.points.material.uniforms.pr.value = pr;
    },
  },
});
