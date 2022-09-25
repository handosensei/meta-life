import * as THREE from 'three';
import Boid from './Boid';
import IMOG from '~/lib/imog';
import useMouse from '~/lib/imog/use/mouse';


const raycaster = new THREE.Raycaster();
const v = new THREE.Vector2();

export default IMOG.Component('TrailsBoid', {
  options: {
    addTo: null,
    color1: new THREE.Color(),
    color2: new THREE.Color(),
  },

  props() {
    return {
      active: true,
      useMouse: useMouse({ normalized: true }),
      mouse: (props) => ({
        x: props.useMouse.x,
        y: props.useMouse.y,
      }),
    };
  },

  async setup({ options }) {
    this.i = 0;
    this.mouseDown = false;

    this.group = new THREE.Group();
    this.group.name = 'TrailsBoid';
    this.group.scale.setScalar(0.006);
    if (options.addTo) options.addTo.add(this.group);

    this.boids = [];

    const numberTrails = 30;
    for (let i = 0; i < numberTrails; i++) {
      const color = i < numberTrails * 0.5 ? options.color1 : options.color2;
      const boid = (this.boids[i] = new Boid({
        position: new THREE.Vector3(Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5),
        color,
      }));
      boid.trail_line.layers.enable(1);
      this.group.add(boid.trail_line);
      boid.setAvoidWalls(true);
      boid.setWorldSize(200, 200, 200);
    }

    this.target = new THREE.Vector3();
    this.raycastSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(200), new THREE.MeshBasicMaterial({ wireframe: true, visible: false }));
    this.group.add(this.raycastSphere);

    this.helperSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(5), new THREE.MeshBasicMaterial({ color: 'yellow', visible: false }));
    this.group.add(this.helperSphere);

    window.addEventListener('mousedown', () => {
      this.mouseDown = true;
    });

    window.addEventListener('mouseup', () => {
      this.boids.forEach((boid, i) => {
        boid.velocity.x = (Math.random() - 0.5) * 5;
        boid.velocity.y = (Math.random() - 0.5) * 5;
        boid.velocity.z = (Math.random() - 0.5) * 5;
        boid.velocity.x = (Math.random() - 0.5) * 5;
        boid.velocity.y = (Math.random() - 0.5) * 5;
        boid.velocity.z = (Math.random() - 0.5) * 5;
      });

      this.mouseDown = false;
    });
  },

  hooks: {
    'set:active'(v) {
      this.group.visible = v;
    },
    'while:active'(v) {
      this.i++;
      if (this.i % 2 !== 0) return;

      this.boids.forEach((boid, i) => {
        boid.run(this.boids);
        boid.run(this.boids);

        if (this.mouseDown) {
          boid.setGoal(this.target);
        } else {
          boid.setGoal(false);
        }
      });
    },
    'set:mouse'({ x, y }) {
      v.set(x * 2, y * 2);
      raycaster.setFromCamera(v, this.$worldCamera);
      const intersects = raycaster.intersectObjects([this.raycastSphere], false);
      if (intersects.length) {
        this.target.copy(intersects[0].point);
        this.group.worldToLocal(this.target);
        this.helperSphere.position.copy(this.target);
      }
    },
  },
});
