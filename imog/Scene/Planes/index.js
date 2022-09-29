import * as THREE from 'three';
import _ from 'underscore';
import { SimplexNoise } from 'simplex-noise';
import VelocityTrailsMaterial from './VelocityTrailsMaterial';
import VelocityPointsMaterial from './VelocityPointsMaterial';
import IMOG from '~/lib/imog';
import { map } from '~/lib/math';

import useMouse from '~/lib/imog/use/mouse';
import useSpring from '~/lib/imog/use/spring';

import TrailsTunnel from '~/imog/TrailsTunnel';
import AmbientLight from '~/imog/AmbientLight';

import FresnelMaterial from '~/imog/_Shared/FresnelMaterial';

const simplex = new SimplexNoise();
const rand = (x, y) => simplex.noise2D(x, y);

const blueColor = new THREE.Color(129 * 0.1, 199 * 0.1, 255 * 0.4);
const lightColor = new THREE.Color(129 * 0.15, 199 * 0.15, 255 * 0.5);

export default IMOG.Component('Planes', {
  options: {
    addTo: null,
    target: null,
  },

  props() {
    return {
      sceneActive: true,

      active: (props) => props.sceneActive && props.progress >= 3.5 && props.progress < 5.5,
      progress: 0,

      mouse: useMouse({ normalized: true }),
      mouseX: useSpring({
        target: (props) => -props.mouse.x,
        friction: 0.1,
      }),
      mouseY: useSpring({
        target: (props) => -props.mouse.y,
        friction: 0.1,
      }),

      pr: (props, { context }) => context.$rendererProps.pr,
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

    const planes = [...this.group.children[0].children];
    this.planes = [];
    this.trails = [];

    planes.forEach((plane, i) => {
      plane.material = new FresnelMaterial({
        color: new THREE.Color(129 * 0.1, 199 * 0.1, 255 * 0.4),
      });
      plane.origin = plane.position.clone();
      plane.layers.enable(1);
      const index = +plane.name.replace('Plane', '');
      this.planes[index] = plane;
      // if (index !== 2) plane.visible = false;
      plane.rootBone = plane.children[0];
      plane.rootBones = plane.children.map((c) => {
        return c.children[0];
      });

      let bi = 0;
      let b = plane.rootBone;
      while (b.children.length) {
        bi++;
        b = b.children[0];
      }
      plane.bonesAmount = bi - 1;

      if (index !== 2) {
        plane.rootBones.forEach((rootBone) => {
          this.simpleBendBone(rootBone, 0, plane.bonesAmount, map(index, 0, 5, -1, 1));
        });
      }

      plane.traverse((child) => {
        if (child.isSkinnedMesh) {
          child.frustumCulled = false;
          child.layers.enable(1);
          child.material = new VelocityTrailsMaterial({
            color: new THREE.Color(5, 5, 70),
            highlightColor: new THREE.Color(8, 211, 224),
          });
          // child.material.color.setRGB(0, 0, 0.4);
          child.material.transparent = true;
          child.material.opacity = 1;
          // if (Math.random() > 0.25) {
          // child.material.uniforms.color.value.setRGB(10, 10, 40);
          // }
          child.parent.scale.setScalar(2.5);
          this.trails.push(child);
        }
      });
    });

    this.trailsTunnelGroup = new THREE.Group();
    this.trailsTunnelGroup.position.copy(this.planes[2].position);
    this.trailsTunnelGroup.rotation.copy(this.planes[2].rotation);
    this.trailsTunnelGroup.scale.copy(this.planes[2].scale);
    this.planes[2].parent.add(this.trailsTunnelGroup);

    this.trailsTunnel = new TrailsTunnel({
      options: {
        addTo: this.trailsTunnelGroup,
      },
    });

    // POINTS
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsAmount = 1000;
    const pointsVertices = new Float32Array(
      _.flatten(
        _.range(pointsAmount).map((i) => {
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI * 0.15;
          const phi = Math.acos(2.0 * v - 1.0) * 0.5 - Math.PI * 0.25;
          const r = 25 * Math.random() + 1;
          // const r = 30 * Math.cbrt(Math.random());
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
      new VelocityPointsMaterial({
        color1: new THREE.Color(0, 144, 129),
        color2: new THREE.Color(16, 16, 255),
        color3: new THREE.Color(11 * 0.5, 146 * 0.5, 255 * 0.5),
      })
    );
    this.points.position.z = -1;
    this.points.layers.enable(1);
    this.planes[2].add(this.points);

    // AMBIENT LIGHT

    this.ambientLight1 = new AmbientLight({
      options: {
        addTo: this.group,
      },
      props: {
        position: { x: 0, y: 0, z: 12 },
        scale: 25,
        color: { r: 7 * 1.2, g: 7 * 1.2, b: 36 * 1.2 },
      },
    });
  },

  methods: {
    bendBone(bone, p, amount, t, intensity) {
      bone.rotation.x = intensity * (1 - p) * 0.2 * (Math.sin(p * 10 + t) + 0.25);
      bone.rotation.y = intensity * (1 - p) * 0.5 * Math.cos(p + t * 0.2);

      // bone.rotation.y = t * 5;

      if (bone.children[0]) {
        this.bendBone(bone.children[0], p + 1 / amount, amount, t, intensity);
      }
    },
    simpleBendBone(bone, p, amount, intensity) {
      bone.rotation.z = 0.5 * intensity * (1 - p) * 0.2 * (Math.sin(p * 10) + 0.25);
      // bone.rotation.y = intensity * (1 - p) * 0.5 * Math.cos(p + t * 0.2);

      // bone.rotation.y = t * 5;

      if (bone.children[0]) {
        this.simpleBendBone(bone.children[0], p + 1 / amount, amount, intensity);
      }
    },
  },

  hooks: {
    'set:progress'(v) {
      const originP = new THREE.Vector3(-2, 5, 18);
      const zeroP = new THREE.Vector3(0, 0, 0);
      if (v <= 4) {
        this.group.children[0].position.copy(originP);
        this.group.children[0].rotation.x = -0.5;
      } else {
        this.group.children[0].position.copy(originP).lerp(zeroP, map(v, 4, 5, 0, 1));
        this.group.children[0].rotation.x = map(v, 4, 5, -0.5, 0);
      }
      this.planes[2].rootBones.forEach((bone, i) => {
        if (i > 2) bone.parent.children[1].material.uniforms.alpha.value = map(v, 4, 4.5, 1, 0, true);
      });

      this.planes.forEach((plane, i) => {
        plane.material.uniforms.color.value.copy(blueColor).lerp(lightColor, map(v, 4, 5, 0, 1, true));
      });

      this.trails.forEach((trail, i) => {
        trail.morphTargetInfluences[0] = map(v, 4, 5, 0, 0.5);
      });

      this.points.material.uniforms.alpha.value = map(v, 4, 4.5, 1, 0, true);
    },
    'set:active'(a) {
      this.group.visible = a;
    },
    'while:active'(dt) {
      this.trails.forEach((trail, i) => {
        trail.material.uniforms.t.value += 0.005 * dt;
      });

      this.points.material.uniforms.time.value += 0.002 * dt;

      const t = performance.now() * 0.05;
      const progress = this.props.progress;
      this.planes.forEach((plane, i) => {
        plane.position.x = plane.origin.x + rand(t * 0.02, i) * 0.1;
        plane.position.y = plane.origin.y + rand(t * 0.02, i + 93.287) * 0.5;
        plane.position.z = plane.origin.z + rand(t * 0.02, i + 983782.28) * 0.1;
        if (i !== 2) {
          const delay = i === 0 || i === 4 ? 0 : 0.4;
          plane.position.z += map(progress, 4, 5.5 - delay, 7, 0, true);
        }
      });

      this.planes[2].position.x = -this.props.mouseX.value * 1;

      const aTween = map(progress, 4, 5, 0, 1, true);

      this.planes[2].rootBones.forEach((bone, i) => {
        this.bendBone(bone, 0, this.planes[2].bonesAmount, t * 0.03 + i * 476.38726, 1 - aTween);
      });
    },
    'set:pr'(pr) {
      this.points.material.uniforms.pr.value = pr;
    },
  },
});
