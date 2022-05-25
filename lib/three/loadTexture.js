import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const loadTexture = (url, { encoding = THREE.sRGBEncoding } = {}) =>
  new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.encoding = encoding;
        resolve(texture);
      },
      () => {},
      () => reject()
    );
  });

export default loadTexture;
