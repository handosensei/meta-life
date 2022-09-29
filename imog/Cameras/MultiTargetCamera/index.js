import _ from 'underscore';
import gsap from 'gsap';
import * as THREE from 'three';
import { SimplexNoise } from 'simplex-noise';
import * as data from './data';
import IMOG from '~/lib/imog';
import { lerp, clamp } from '~/lib/math';

import useWindowSize from '~/lib/imog/use/windowSize';
import useMouse from '~/lib/imog/use/mouse';
import useSpring from '~/lib/imog/use/spring';

const wP = new THREE.Vector3();
const simplex = new SimplexNoise();
const rand = (x, y) => simplex.noise2D(x, y);

export default IMOG.Component('MultiTargetCamera', {
  options: {
    addTo: null,
  },

  props() {
    return {
      ready: false,
      active: true,
      helpers: false,
      isMobile: false,

      target: 0,
      computedTarget: (props) => (props.ready ? props.target : -1),
      progress: 0,
      prevIndex: (props) => clamp(Math.floor(props.progress), 0, props.offsets.length - 1),
      nextIndex: (props) => clamp(Math.ceil(props.progress), 0, props.offsets.length - 1),
      localProgress: (props) => props.progress % 1,
      cameraProgressData: (props) => _.pick(props, 'ready', 'prevIndex', 'nextIndex', 'localProgress'),

      offsets: (props) => (props.isMobile ? _.values(data.offsetsMobile) : _.values(data.offsets)),
      zooms: (props) => (props.isMobile ? _.values(data.zoomsMobile) : 1),
      shakes: _.values(data.shakes),
      ambients: _.values(data.ambients),

      windowSize: useWindowSize(),
      projectionData: (props) => {
        const prevOffset = props.offsets[props.prevIndex];
        const nextOffset = props.offsets[props.nextIndex];
        const offset = [lerp(props.localProgress, prevOffset[0], nextOffset[0]), lerp(props.localProgress, prevOffset[1], nextOffset[1])];
        const prevZoom = props.zooms[props.prevIndex];
        const nextZoom = props.zooms[props.nextIndex];
        const zoom = props.isMobile ? lerp(props.localProgress, prevZoom, nextZoom) : 1;

        return {
          offset,
          zoom,
          width: props.windowSize.width,
          height: props.windowSize.height,
        };
      },

      shakeAmount: (props) => {
        const prev = props.shakes[props.prevIndex];
        const next = props.shakes[props.nextIndex];
        return lerp(props.localProgress, prev, next);
      },

      ambientAmount: (props) => {
        if (props.isMobile) return 0;
        const prev = props.ambients[props.prevIndex];
        const next = props.ambients[props.nextIndex];
        return lerp(props.localProgress, prev, next);
      },
      mouse: useMouse({ normalized: true }),
      mouseX: useSpring({
        target: (props) => -props.mouse.x * props.ambientAmount,
        friction: 0.1,
      }),
      mouseY: useSpring({
        target: (props) => -props.mouse.y * props.ambientAmount * (props.windowSize.height / props.windowSize.width),
        friction: 0.1,
      }),
    };
  },

  async setup({ options }) {
    this.camera = new THREE.PerspectiveCamera(16.5, 1, 0.1, 200);
    this.helper = new THREE.CameraHelper(this.camera);
    this.cameraContainer = new THREE.Object3D();
    this.cameraContainer.isCamera = true;
    this.cameraContainer.add(this.camera);

    if (options.addTo) {
      options.addTo.add(this.cameraContainer);
      options.addTo.add(this.helper);
    }

    this.pointHelper = new THREE.Mesh(new THREE.BoxBufferGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: 'red' }));
    this.planeHelper = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), new THREE.MeshBasicMaterial({ color: 'red', wireframe: true }));
    if (options.addTo) {
      options.addTo.add(this.pointHelper);
      options.addTo.add(this.planeHelper);
    }

    this.position = new THREE.Vector3(0, 1, 10);
    this.lookAt = new THREE.Vector3(0, 0, 0);

    if (this.$gui) {
      this.guiF = this.$gui.addFolder({
        title: 'MultiTargetCamera',
        expanded: false,
      });
      this.guiF.addInput(this.props, 'helpers');
    }
  },

  methods: {
    setTargets({ positions, targets }) {
      this.positions = _.sortBy(positions, (p) => +p.name.replace('Position', ''));
      this.positions = this.positions.map((t) => t.position);
      this.targets = _.sortBy(targets, (p) => +p.name.replace('LookAt', ''));
      this.targets = this.targets.map((t) => t.position);
      if (this.positions.length !== this.targets.length) console.warn('Camera GLTF error! Amount of positions and lookAts should be the same');

      this.props.ready = true;
    },
  },

  hooks: {
    'set:helpers'(v) {
      this.helper.visible = v;
      this.pointHelper.visible = v;
      this.planeHelper.visible = v;
    },
    'set:projectionData'({ width, height, pr, offset, zoom }) {
      this.camera.aspect = width / height;
      this.camera.setViewOffset(width, height, offset[0] * width, offset[1] * height, width, height);
      this.camera.zoom = zoom;
      this.camera.updateProjectionMatrix();
      this.planeHelper.scale.x = this.camera.aspect;
    },
    'while:active'() {
      const { mouse, mouseX, mouseY } = this.props;
      this.camera.position.set(0, 0, 0);

      const pathPosition = this.position;
      const lookAtPosition = this.lookAt;

      this.cameraContainer.position.copy(pathPosition);
      this.cameraContainer.lookAt(lookAtPosition);

      this.pointHelper.position.copy(pathPosition);
      this.planeHelper.position.copy(pathPosition);
      this.planeHelper.quaternion.copy(this.cameraContainer.quaternion);

      this.camera.position.x -= this.props.mouseX.value * 7;
      this.camera.position.y -= this.props.mouseY.value * 3;
      this.camera.getWorldPosition(wP);

      this.cameraContainer.rotation.set(0, 0, 0);
      this.cameraContainer.position.set(0, 0, 0);

      this.camera.position.copy(wP);
      this.camera.lookAt(lookAtPosition);

      const time = performance.now() * 3;
      const shake = this.props.shakeAmount;
      this.camera.position.x += rand(8437.84, time * 0.001) * 0.1 * shake;
      this.camera.position.y += rand(3618.43, time * 0.005) * 0.1 * shake;
      this.camera.position.z += rand(1038.16, time * 0.003) * 0.1 * shake;

      this.helper.update();
    },
    // 'set:computedTarget'(index, prevIndex) {
    //   if (index === -1) return;
    //
    //   let duration = prevIndex !== index + 1 && prevIndex !== index - 1 ? 0 : 2;
    //   if (prevIndex === -1) duration = 0;
    // },
    'set:cameraProgressData'({ prevIndex, nextIndex, localProgress }) {
      if (!this.props.ready) {
        this.position.set(99, 99, 99);
        this.lookAt.set(99, 1000, 99);

        return;
      }

      const prevPosition = this.positions[prevIndex];
      const nextPosition = this.positions[nextIndex];
      this.position.copy(prevPosition).lerp(nextPosition, localProgress);

      const prevTarget = this.targets[prevIndex];
      const nextTarget = this.targets[nextIndex];
      this.lookAt.copy(prevTarget).lerp(nextTarget, localProgress);
    },
  },
});
