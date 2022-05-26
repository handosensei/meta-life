import * as THREE from 'three';
import IMOG from '~/lib/imog';
import _ from 'underscore';
import { map } from '~/lib/math';

import useMouse from '~/lib/imog/use/mouse';
import useSpring from '~/lib/imog/use/spring';

import TrailsTunnel from '~/imog/TrailsTunnel';

import FresnelMaterial from '~/imog/_Shared/FresnelMaterial';

import { SimplexNoise } from 'simplex-noise';
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
      active: true,
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

      plane.traverse((child) => {
        if (child.isSkinnedMesh) {
          child.frustumCulled = false;
          child.layers.enable(1);
          child.material = child.material.clone();
          child.material.color.setRGB(0, 0, 0.4);
          child.material.transparent = true;
          child.material.opacity = 1;
          if (Math.random() > 0.25) {
            child.material.color.setRGB(0.1, 0.1, 0.4);
          }
          child.parent.scale.setScalar(2.5);
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
  },

  hooks: {
    'set:progress'(v) {
      this.group.visible = v < 5.5 && v > 3.5;
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
        if (i > 2) bone.parent.children[1].material.opacity = map(v, 4, 4.5, 1, 0, true);
      });

      this.planes.forEach((plane, i) => {
        plane.material.uniforms.color.value.copy(blueColor).lerp(lightColor, map(v, 4, 5, 0, 1, true));
      });
    },
    'while:active'() {
      const t = performance.now() * 0.05;
      const progress = this.props.progress;
      this.planes.forEach((plane, i) => {
        plane.position.x = plane.origin.x + rand(t * 0.02, i) * 0.1;
        plane.position.y = plane.origin.y + rand(t * 0.02, i + 93.287) * 0.5;
        plane.position.z = plane.origin.z + rand(t * 0.02, i + 983782.28) * 0.1;
        if (i !== 2) {
          const delay = i === 0 || i === 4 ? 0 : 0.4;
          plane.position.z += map(progress, 4, 5 - delay, 7, 0, true);
        }
      });

      this.planes[2].position.x = -this.props.mouseX.value * 1;

      const aTween = map(progress, 4, 5, 0, 1, true);

      this.planes[2].rootBones.forEach((bone, i) => {
        this.bendBone(bone, 0, this.planes[2].bonesAmount, t * 0.03 + i * 476.38726, 1 - aTween);
      });
    },
  },
});
