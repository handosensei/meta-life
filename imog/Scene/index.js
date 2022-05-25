import * as THREE from 'three';
import IMOG from '~/lib/imog';
import loadTexture from '~/lib/three/loadTexture';

import Sky from './Sky';
import Floor from './Floor';
import Planets from './Planets';
import Planes from './Planes';
import Coins from './Coins';
import Land from './Land';

export default IMOG.Component('Scene', {
  options: {
    addTo: null,
    referenceScene: null,
  },

  props() {
    return {
      active: false,
      target: 0,
      progress: 0,
    };
  },

  async setup({ options }) {
    options.addTo.add(options.referenceScene);

    this.sky = new Sky({ options: { addTo: options.addTo } });

    this.planets = new Planets({
      options: {
        addTo: options.addTo,
        target: options.referenceScene.getObjectByName('Planets'),
      },
      props: {
        target: (props) => this.props.target,
        progress: () => this.props.progress,
      },
    });

    this.planes = new Planes({
      options: {
        addTo: options.addTo,
        target: options.referenceScene.getObjectByName('Planes'),
      },
      props: {
        target: (props) => this.props.target,
        progress: () => this.props.progress,
      },
    });

    this.coins = new Coins({
      options: {
        addTo: options.addTo,
        target: options.referenceScene.getObjectByName('Coin'),
      },
      props: {
        target: (props) => this.props.target,
        progress: () => this.props.progress,
      },
    });

    this.land = new Land({
      options: {
        addTo: options.addTo,
        target: options.referenceScene.getObjectByName('Land'),
      },
      props: {
        target: (props) => this.props.target,
        progress: () => this.props.progress,
      },
    });

    this.props.active = true;
  },

  hooks: {
    'while:active'() {},
  },
});
