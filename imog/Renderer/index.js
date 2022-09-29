import * as THREE from 'three';
import IMOG from '~/lib/imog';
import { getGPUTier } from 'detect-gpu';
import useWindowSize from '~/lib/imog/use/windowSize';

import OrbitCamera from '~/imog/Cameras/OrbitCamera';
import BasicCamera from '~/imog/Cameras/BasicCamera';
import KeyboardCamera from '~/imog/Cameras/KeyboardCamera';

import PostMaterial from './material';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from './UnrealBloomPass';

const quadGeometry = new THREE.PlaneBufferGeometry(1, 1);

export default IMOG.Component('Renderer', {
  options: {
    domElement: null,
    renderDepthBuffer: false,
    multiTargetCamera: null,
  },

  props() {
    return {
      isMobile: false,
      windowSize: useWindowSize(),
      quality: 'low',
      pr: (props) => {
        const resolution = props.windowSize.width * props.windowSize.height;
        return { low: 1.5, mid: 1.5, high: resolution > 1500000 ? 1.5 : 2 }[props.quality || 0];
      },
      size: (props) => ({
        width: props.windowSize.width,
        height: props.windowSize.height,
        pr: props.pr,
      }),
      windowFocused: true,

      cameraType: 'multiTarget',

      levels: { x: 0, y: 0.8, z: 0.8 },
      saturation: 1.13,

      bloomActive: true,
      bloomStrength: 1.8,
      bloomThreshold: 0,
      bloomRadius: 0.8,
      bloomRadiusComputed: (props) => (props.bloomRadius * props.pr) / 2.5,
    };
  },

  setup({ options }) {
    this.renderer = new THREE.WebGLRenderer({
      antialiased: false,
    });
    this.renderer.autoClear = false;
    this.renderer.toneMapping = THREE.CustomToneMapping;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFShadowMap;

    if (!options.domElement) {
      document.body.appendChild(this.renderer.domElement);
      this.renderer.domElement.className = 'main-canvas';
    } else {
      options.domElement.appendChild(this.renderer.domElement);
    }
    IMOG.inject('renderer', this.renderer);
    IMOG.inject('rendererProps', this.props);

    // world
    this.worldScene = new THREE.Scene();
    this.orbitCamera = new OrbitCamera();
    this.orbitCamera.init();
    this.worldCamera = this.orbitCamera.camera;
    this.basicCamera = new BasicCamera({
      options: { addTo: this.worldScene },
      props: {
        active: (props) => this.props.cameraType === 'basic' || this.props.cameraType === 'orbit',
        helpers: (props) => this.props.cameraType === 'orbit',
      },
    });
    this.keyboardCamera = new KeyboardCamera({
      options: { addTo: this.worldScene },
      props: {
        active: (props) => this.props.cameraType === 'keyboard',
      },
    });
    this.multiTargetCamera = options.multiTargetCamera;
    this.worldScene.add(this.multiTargetCamera.cameraContainer);
    this.worldScene.add(this.multiTargetCamera.helper);

    this.worldTarget = new THREE.WebGLRenderTarget(1, 1);
    this.worldTarget.texture.encoding = THREE.sRGBEncoding;
    this.worldTarget.texture.generateMipmaps = false;
    this.worldTarget.texture.minFilter = THREE.NearestFilter;
    this.worldTarget.texture.magFilter = THREE.NearestFilter;
    this.worldTarget.stencilBuffer = false;
    this.worldTarget.depthBuffer = true;
    IMOG.inject('worldTarget', this.worldTarget);

    this.vfxTarget = new THREE.WebGLRenderTarget(1, 1, {});
    // this.vfxTarget.texture.encoding = THREE.sRGBEncoding;
    this.vfxTarget.texture.generateMipmaps = false;
    // this.vfxTarget.texture.minFilter = THREE.NearestFilter;
    // this.vfxTarget.texture.magFilter = THREE.NearestFilter;
    this.vfxTarget.stencilBuffer = false;
    this.vfxTargetBloom = new THREE.WebGLRenderTarget(1, 1, {});
    // this.vfxTargetBloom.texture.encoding = THREE.sRGBEncoding;
    this.vfxTargetBloom.texture.generateMipmaps = false;
    // this.vfxTargetBloom.texture.minFilter = THREE.NearestFilter;
    // this.vfxTargetBloom.texture.magFilter = THREE.NearestFilter;
    this.vfxTargetBloom.stencilBuffer = false;

    // screen
    this.postMaterial = new PostMaterial({
      options: {
        worldTarget: this.worldTarget.texture,
        vfxTarget: this.vfxTarget.texture,
        vfxTargetBloom: this.vfxTargetBloom.texture,
      },
    });
    this.screenScene = new THREE.Scene();
    this.screenQuad = new THREE.Mesh(quadGeometry, this.postMaterial.material);
    this.screenScene.add(this.screenQuad);
    this.screenCamera = new THREE.OrthographicCamera();
    this.screenCamera.position.z = 100;

    // effect composer
    this.renderScene = new RenderPass(this.screenScene, this.screenCamera);

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = this.props.bloomThreshold;
    this.bloomPass.strength = this.props.bloomStrength;
    this.bloomPass.radius = this.props.bloomRadiusComputed;

    this.composer = new EffectComposer(this.$renderer);
    // this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
    // this.composer.addPass(this.LinearTosRGBPass);

    if (this.$gui) {
      const fCameras = this.$gui
        .addFolder({
          title: 'Cameras',
          expanded: false,
        })
        .addInput(this.props, 'cameraType', {
          options: {
            basic: 'basic',
            orbit: 'orbit',
            multiTarget: 'multiTarget',
          },
        });
      const fGrading = this.$gui.addFolder({
        title: 'ToneMapping',
        expanded: false,
      });
      fGrading
        .addInput(this.props, 'levels', {
          x: { step: 0.01 },
          y: { step: 0.01 },
          z: { step: 0.01 },
        })
        .on('change', () => {
          const obj = { ...this.props.levels };
          obj[Math.random()] = 0;
          this.props.levels = obj;
        });
      fGrading.addInput(this.props, 'saturation', { min: 0, max: 2 });

      const fBloom = this.$gui.addFolder({
        title: 'Bloom',
        expanded: false,
      });
      fBloom.addInput(this.props, 'bloomActive');
      fBloom.addInput(this.props, 'bloomStrength');
      fBloom.addInput(this.props, 'bloomThreshold');
      fBloom.addInput(this.props, 'bloomRadius');
    }

    setTimeout(() => {
      // this.props.bloomActive = true;
      if (this.$gui) this.$gui.refresh();
    }, 0);

    (async () => {
      const gpuTier = await getGPUTier({
        glContext: this.renderer.getContext(),
        desktopTiers: [0, 15, 30, 50],
      });
      this.props.quality = 'high'; // gpuTier.tier >= 2 ? 'high' : 'normal';
    })();

    window.addEventListener('focus', this.handleWindowFocus);
    window.addEventListener('blur', this.handleWindowBlur);
  },

  destroy() {
    clearInterval(this.spawnInterval);
    window.removeEventListener('focus', this.handleWindowFocus);
    window.removeEventListener('blur', this.handleWindowBlur);
  },

  hooks: {
    'set:size'({ width, height, pr }) {
      // renderer
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(pr);

      // world
      this.worldTarget.setSize(width * pr, height * pr);
      this.worldCamera.aspect = width / height;
      this.worldCamera.updateProjectionMatrix();

      this.vfxTarget.setSize(width * pr, height * pr);
      this.vfxTargetBloom.setSize(width * pr, height * pr);
      this.composer.setSize(width * pr, height * pr);

      //screen
      this.screenCamera.left = (-width * pr) / 2;
      this.screenCamera.right = (width * pr) / 2;
      this.screenCamera.top = (height * pr) / 2;
      this.screenCamera.bottom = (-height * pr) / 2;
      this.screenCamera.updateProjectionMatrix();
      this.screenQuad.scale.set(width * pr, height * pr, 1);

      // post
      this.postMaterial.material.uniforms.resolution.value = [width * pr, height * pr];
    },

    'set:cameraType'(type) {
      if (type === 'orbit') {
        this.orbitCamera.camera.position.copy(this.multiTargetCamera.camera.position);
        this.orbitCamera.camera.rotation.copy(this.multiTargetCamera.camera.rotation);
        this.worldCamera = this.orbitCamera.camera;
        this.orbitCamera.controls.reset();
      }
      if (type === 'basic') {
        this.worldCamera = this.basicCamera.camera;
        this.orbitCamera.controls.saveState();
        this.basicCamera.props.wheelActive = true;
      }
      if (type === 'keyboard') {
        this.worldCamera = this.keyboardCamera.camera;
      }
      if (type === 'multiTarget') {
        this.worldCamera = this.multiTargetCamera.camera;
      }
      IMOG.inject('worldCamera', this.worldCamera);
    },
    'set:bloomStrength'(v) {
      this.bloomPass.strength = v;
    },
    'set:bloomThreshold'(v) {
      this.bloomPass.threshold = v;
    },
    'set:bloomRadiusComputed'(v) {
      this.bloomPass.radius = v;
    },
    'set:levels'({ x, y, z }) {
      this.postMaterial.material.uniforms.levels.value.set(x, y, z);
    },
    'set:saturation'(v) {
      this.postMaterial.material.uniforms.saturation.value = v;
    },
  },

  methods: {
    render(ms) {
      this.postMaterial.material.uniforms.uTime.value += 0.1;
      if (!this.props.bloomActive) {
        // Scene
        this.worldCamera.layers.set(0);
        this.renderer.setRenderTarget(this.worldTarget);
        this.renderer.clear();
        this.renderer.render(this.worldScene, this.worldCamera);
      } else {
        // Scene
        this.renderer.setRenderTarget(this.worldTarget);
        this.renderer.clear();
        this.worldCamera.layers.set(0);
        this.renderer.render(this.worldScene, this.worldCamera);

        // Bloom
        this.renderer.setRenderTarget(this.vfxTarget);
        this.renderer.clear();
        this.worldCamera.layers.set(1);
        this.renderer.render(this.worldScene, this.worldCamera);
        this.bloomPass.render(this.$renderer, this.vfxTargetBloom, this.vfxTarget);

        // Screen
        this.renderer.setRenderTarget(null);
        this.renderer.clear();
        this.renderer.render(this.screenScene, this.screenCamera);
      }
    },

    handleWindowFocus() {
      this.props.windowFocused = true;
      this.props.active = true;
    },
    handleWindowBlur() {
      this.props.windowFocused = false;
      this.props.active = false;
    },
  },
});
