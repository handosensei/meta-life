import * as THREE from 'three';
import IMOG from '~/lib/imog';
import useWindowSize from '~/lib/imog/use/windowSize';
import useMouse from '~/lib/imog/use/mouse';
import useSpring from '~/lib/imog/use/spring';
import useWheel from '~/lib/imog/use/wheel';

const wP = new THREE.Vector3();

export default IMOG.Component('BasicCamera', {
  options: {
    addTo: null,
  },

  props() {
    return {
      active: true,
      helpers: true,
      windowSize: useWindowSize(),
      size: (props) => ({
        width: props.windowSize.width,
        height: props.windowSize.height,
      }),
      mouse: useMouse({ normalized: true }),
      mouseX: useSpring({
        target: (props) => props.mouse.x,
        friction: 0.1,
      }),
      mouseY: useSpring({
        target: (props) => props.mouse.y,
        friction: 0.1,
      }),
    };
  },

  setup({ options }) {
    this.camera = new THREE.PerspectiveCamera(20, 1, 2, 50);
    this.helper = new THREE.CameraHelper(this.camera);
    this.cameraContainer = new THREE.Object3D();
    this.cameraContainer.isCamera = true;
    this.cameraContainer.add(this.camera);
    if (options.addTo) {
      options.addTo.add(this.cameraContainer);
      // options.addTo.add(this.helper);
    }

    this.pointHelper = new THREE.Mesh(new THREE.BoxBufferGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: 'red' }));
    this.planeHelper = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), new THREE.MeshBasicMaterial({ color: 'red', wireframe: true }));
    if (options.addTo) {
      // options.addTo.add(this.pointHelper);
      // options.addTo.add(this.planeHelper);
    }

    this.position = new THREE.Vector3(0, 1, 10);
    this.lookAt = new THREE.Vector3(0, 0, 0);

    // IMOG.inject('worldCamera', this.camera);
  },

  hooks: {
    'set:helpers'(v) {
      this.helper.visible = v;
      this.pointHelper.visible = v;
      this.planeHelper.visible = v;
    },
    'set:size'({ width, height, pr }) {
      this.camera.aspect = width / height;
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

      this.helper.update();
    },
  },
});
