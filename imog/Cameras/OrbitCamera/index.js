import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import IMOG from '~/lib/imog';
import useWindowSize from '~/lib/imog/use/windowSize';

export default IMOG.Component('OrbitCamera', {
  options: {
    helpers: false,
    maxPolarAngle: Math.PI * 0.52,
    minPolarAngle: Math.PI * 0.35,
    extraControls: true,
  },

  props() {
    return {
      active: true,
      windowSize: useWindowSize(),
      size: (props) => ({
        width: props.windowSize.width,
        height: props.windowSize.height,
      }),
    };
  },

  setup({ options }) {
    this.camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
    // this.cameraRef = new THREE.PerspectiveCamera(20, 1, 2, 50);

    IMOG.inject('worldCamera', this.camera);
  },

  methods: {
    init() {
      const { maxPolarAngle, minPolarAngle, extraControls } = this.options;
      this.camera.position.set(4, 0, 8);
      this.controls = new OrbitControls(this.camera, this.$renderer.domElement);
      // this.controls.target.set(0, 2, 0);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.15;
      if (!extraControls) {
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
      }
      this.controls.minDistance = 1.5;
      this.controls.maxDistance = 200;

      // this.controls.maxPolarAngle = maxPolarAngle;
      // this.controls.minPolarAngle = minPolarAngle;
    },
  },

  hooks: {
    'set:size'({ width, height, pr }) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
    'while:active'() {
      if (this.controls) {
        // this.controls.target.set(0, 0.6, 0);
        this.controls.update();
      }
    },
  },
});
