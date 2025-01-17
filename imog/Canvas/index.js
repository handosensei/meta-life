import _ from 'underscore';
import gsap from 'gsap';
import * as THREE from 'three';
import IMOG from '~/lib/imog';
import loadGLTF from '~/lib/three/loadGLTF';

import MultiTargetCamera from '~/imog/Cameras/MultiTargetCamera';
import Renderer from '~/imog/Renderer';
import Scene from '~/imog/Scene';

let urlParams = {};
if (!(process.env.isNuxt && !process.client)) {
  urlParams = new URLSearchParams(window.location.search);
}

export default IMOG.Component('Canvas', {
  options: {
    handleReady: () => {},
    handleItemLoaded: () => {},
    domElement: null,
  },

  props() {
    return {
      ready: false,

      active: true,
      computedActive: (props) => props.ready && props.active,

      target: +urlParams.get('target') || 0,
      computedTarget: (props) => (props.ready ? props.target : -1),
      progress: 0,

      isMobile: urlParams.get('isMobile') !== null || false,
    };
  },

  async setup({ options }) {
    if (this.$gui) {
      this.guiF = this.$gui.addFolder({
        title: 'Target',
      });
      this.guiF.addInput(this.props, 'target', {
        options: _.object(_.range(0, 8), _.range(0, 8)),
      });
    }

    const setupTasks = [];

    this.multiTargetCamera = new MultiTargetCamera({
      props: {
        target: (props) => this.props.target,
        progress: (props) => this.props.progress,
        isMobile: (props) => this.props.isMobile,
      },
    });

    this.renderer = new Renderer({
      options: {
        domElement: options.domElement,
        multiTargetCamera: this.multiTargetCamera,
      },
      props: {
        isMobile: (props) => this.props.isMobile,
      },
    });

    const cameraGltf = await loadGLTF('/gltf/camera/optim.glb', {
      renderer: this.$renderer,
    });
    const targets = [];
    const positions = [];
    cameraGltf.scene.traverse((child) => {
      if (child.name.match('LookAt')) targets.push(child);
      if (child.name.match('Position')) positions.push(child);
    });

    this.renderer.multiTargetCamera.setTargets({ positions, targets });

    this.scene = new Scene({
      options: {
        addTo: this.renderer.worldScene,
        referenceScene: cameraGltf.scene,
      },
      props: {
        canvasActive: (props) => this.props.computedActive,
        target: (props) => this.props.target,
        progress: (props) => this.props.progress,
      },
    });

    THREE.DefaultLoadingManager.onLoad = () => {
      options.handleReady();
      this.$trigger('mainLoad');
      this.props.ready = true;
    };

    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      options.handleItemLoaded({ itemsLoaded, itemsTotal });
    };

    THREE.DefaultLoadingManager.onError = function (url) {
      console.log('There was an error loading ' + url);
    };
    THREE.DefaultLoadingManager.itemStart('dummy');
    THREE.DefaultLoadingManager.itemEnd('dummy');
  },

  render() {
    if (!this.props.computedActive) return;
    this.renderer.render();
  },

  hooks: {
    'set:computedTarget'(index, prevIndex) {
      if (index === -1) return;

      gsap.killTweensOf(this.props, { progress: true });

      const duration = prevIndex !== index + 1 && prevIndex !== index - 1 ? 0 : 1.5;

      gsap.to(this.props, {
        progress: index,
        duration,
        ease: 'power3.inOut',
      });
    },
  },
});
