import * as THREE from 'three';
import IMOG from '~/lib/imog';
import useWindowSize from '~/lib/imog/use/windowSize';
import useMouse from '~/lib/imog/use/mouse';
import useSpring from '~/lib/imog/use/spring';
import useWheel from '~/lib/imog/use/wheel';
import { clamp } from '~/lib/math';

const step = new THREE.Vector3();
const lookAt = new THREE.Vector3();

export default IMOG.Component('KeyboardCamera', {
  options: {
    addTo: null,
    minY: -10,
    maxY: 90,
    cameraY: 1,
  },

  props() {
    return {
      active: false,
      windowSize: useWindowSize(),
      size: (props) => ({
        width: props.windowSize.width,
        height: props.windowSize.height,
      }),
    };
  },

  setup({ options }) {
    this.camera = new THREE.PerspectiveCamera(20, 1, 2, 50);
    this.cameraContainer = new THREE.Object3D();
    this.cameraContainer.isCamera = true;
    this.cameraContainer.add(this.camera);
    if (options.addTo) {
      options.addTo.add(this.cameraContainer);
    }

    this.positionTarget = new THREE.Vector3(0, options.cameraY, 10);

    this.cameraContainer.position.set(0, options.cameraY, 10);
    this.latTarget = 0;
    this.lat = 0;
    this.lonTarget = 180;
    this.lon = 0;
    this.rotationFriction = 0.9;

    // IMOG.inject('worldCamera', this.camera);
  },

  hooks: {
    'set:size'({ width, height, pr }) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
    'while:active'() {
      this.cameraContainer.position.x += (this.positionTarget.x - this.cameraContainer.position.x) * 0.1;
      this.cameraContainer.position.y += (this.positionTarget.y - this.cameraContainer.position.y) * 0.1;
      this.cameraContainer.position.z += (this.positionTarget.z - this.cameraContainer.position.z) * 0.1;

      this.lat += (this.latTarget - this.lat) * this.rotationFriction;
      this.lon += (this.lonTarget - this.lon) * this.rotationFriction;
      const phi = THREE.MathUtils.degToRad(90 - this.lat);
      const theta = THREE.MathUtils.degToRad(this.lon);
      lookAt.setFromSphericalCoords(1, phi, theta).add(this.cameraContainer.position);
      if (!lookAt.y) lookAt.y = 0;
      this.cameraContainer.lookAt(lookAt);
    },
    'set:active'(active) {
      const canvas = document.querySelector('canvas');
      if (active) {
        window.addEventListener('keydown', this.handleKeydDown, false);
        canvas.addEventListener('pointerdown', this.handleMouseDown, false);
        canvas.addEventListener('pointermove', this.handleMouseMove, false);
        canvas.addEventListener('pointerup', this.handleMouseUp, false);
      } else {
        window.removeEventListener('keydown', this.handleKeydDown, false);
        canvas.removeEventListener('pointerdown', this.handleMouseDown, false);
        canvas.removeEventListener('pointermove', this.handleMouseMove, false);
        canvas.removeEventListener('pointerup', this.handleMouseUp, false);
      }
    },
  },

  methods: {
    handleKeydDown({ key }) {
      if (['a', 'w', 's', 'd'].includes(key)) {
        if (key === 'a') step.set(-1, 0, 0);
        if (key === 'w') step.set(0, 0, -1);
        if (key === 's') step.set(0, 0, 1);
        if (key === 'd') step.set(1, 0, 0);
        this.camera.position.add(step.multiplyScalar(2));
        this.camera.getWorldPosition(this.positionTarget);
        this.positionTarget.y = this.options.cameraY;
        this.camera.position.set(0, 0, 0);
      }
    },
    handleMouseDown({ clientX, clientY }) {
      this.dragging = true;
      this.dragMouseOrigin = { x: clientX, y: clientY };
      this.lonTargetOrigin = this.lonTarget;
      this.latTargetOrigin = this.latTarget;
      this.rotationFriction = 0.2;
    },
    handleMouseMove({ clientX, clientY }) {
      if (this.dragging) {
        const diffX = clientX - this.dragMouseOrigin.x;
        const diffY = clientY - this.dragMouseOrigin.y;

        this.lonTarget = this.lonTargetOrigin + diffX * 0.03;
        this.latTarget = this.latTargetOrigin + diffY * 0.03;
        this.latTarget = clamp(this.latTarget, this.options.minY, this.options.maxY);
      }
    },
    handleMouseUp() {
      this.dragging = false;
    },
  },
});
