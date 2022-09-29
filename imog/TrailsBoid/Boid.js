import _ from 'underscore';
import * as THREE from 'three';

import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { CustomLineMaterial } from './Material';

const v = new THREE.Vector3();

const Boid = function ({ position = new THREE.Vector3(), velocity = new THREE.Vector3(), color = 0xffffff } = {}) {
  const self = this;

  let vector = new THREE.Vector3();
  let _acceleration;
  let _width = 500;
  let _height = 500;
  let _depth = 500;
  let _goal;
  const _neighborhoodRadius = 50;
  const _maxSpeed = 4;
  const _maxSteerForce = 0.2;
  let _avoidWalls = false;

  this.position = position;
  this.velocity = velocity;
  _acceleration = new THREE.Vector3();
  this.acceleration = _acceleration;

  this.trail_initialized = false;

  this.initTrail = function () {
    // Create the line geometry used for storing verticies

    // Create the line mesh
    // const positions = _.range(10 * 3).map(() => Math.random() * 4 - 2);
    this.positions = _.flatten(_.range(Math.random() > 0.5 ? 12 : 24).map((i) => [this.position.x + i * 0.1, this.position.y + i * 0.1, this.position.z + i * 0.1]));

    this.trail_geometry = new LineGeometry();
    this.trail_geometry.setPositions(this.positions);

    this.trail_material = new CustomLineMaterial({
      color,
      worldUnits: true,
      linewidth: 0.003, // in world units with size attenuation, pixels otherwise
      vertexColors: false,
      // resolution: [innerWidth, innerHeight],

      // resolution:  // to be set by renderer, eventually
      dashed: false,
      alphaToCoverage: true,
    });
    // this.trail_material.blending = THREE.AdditiveBlending;
    // this.trail_material.depthWrite = false;
    // this.trail_material.depthTest = false;
    this.trail_material.resolution.set(innerWidth, innerHeight);

    this.trail_line = new Line2(this.trail_geometry, this.trail_material);
    this.trail_line.computeLineDistances();
    this.trail_line.scale.set(1, 1, 1);

    this.trail_initialized = true;
  };
  self.initTrail();

  this.setGoal = function (target) {
    _goal = target;
  };

  this.setAvoidWalls = function (value) {
    _avoidWalls = value;
  };

  this.setWorldSize = function (width, height, depth) {
    _width = width;
    _height = height;
    _depth = depth;
  };

  this.run = function (boids) {
    if (_avoidWalls) {
      vector.set(-_width, this.position.y, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(8);
      _acceleration.add(vector);

      vector.set(_width, this.position.y, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(8);
      _acceleration.add(vector);

      vector.set(this.position.x, -_height, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(8);
      _acceleration.add(vector);

      vector.set(this.position.x, _height, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(8);
      _acceleration.add(vector);

      vector.set(this.position.x, this.position.y, -_depth);
      vector = this.avoid(vector);
      vector.multiplyScalar(8);
      _acceleration.add(vector);

      vector.set(this.position.x, this.position.y, _depth);
      vector = this.avoid(vector);
      vector.multiplyScalar(8);
      _acceleration.add(vector);
    } /* else {
						this.checkBounds();
					}
					*/

    vector.set(0, 0, 0);
    this.repulse(vector);

    if (Math.random() > 0.9) {
      this.flock(boids);
    }

    if (_goal) {
      _acceleration.add(this.reach(_goal, 0.005));
    }

    // vector.multiplyScalar(20);
    // _acceleration.add(vector);

    this.move();
  };

  this.flock = function (boids) {
    _acceleration.add(this.alignment(boids));
    _acceleration.add(this.cohesion(boids));
    _acceleration.add(this.separation(boids));
  };

  this.move = function () {
    this.velocity.add(_acceleration);

    const l = this.velocity.length();

    if (l > _maxSpeed) {
      this.velocity.divideScalar(l / _maxSpeed);
    }

    v.copy(this.velocity);
    v.multiplyScalar(1);
    this.position.add(v);
    _acceleration.set(0, 0, 0);

    // Advance the trail by one position
    if (this.trail_initialized) {
      this.positions.unshift(this.position.x, this.position.y, this.position.z);
      this.positions.pop();
      this.positions.pop();
      this.positions.pop();
      this.trail_geometry.setPositions(this.positions);
      // this.trail_line.advance(this.position);
    }
  };

  this.checkBounds = function () {
    if (this.position.x > _width) this.position.x = -_width;
    if (this.position.x < -_width) this.position.x = _width;
    if (this.position.y > _height) this.position.y = -_height;
    if (this.position.y < -_height) this.position.y = _height;
    if (this.position.z > _depth) this.position.z = -_depth;
    if (this.position.z < -_depth) this.position.z = _depth;
  };

  //

  this.avoid = function (target) {
    const steer = new THREE.Vector3();

    steer.copy(this.position);
    steer.sub(target);

    steer.multiplyScalar(1 / this.position.distanceToSquared(target));

    return steer;
  };

  this.repulse = function (target) {
    const distance = this.position.distanceTo(target);

    if (distance < 300) {
      const steer = new THREE.Vector3();

      steer.subVectors(this.position, target);
      steer.multiplyScalar(0.1 / distance);

      _acceleration.add(steer);
    }
  };

  this.reach = function (target, amount) {
    const steer = new THREE.Vector3();

    steer.subVectors(target, this.position);
    steer.multiplyScalar(amount);

    return steer;
  };

  this.alignment = function (boids) {
    let boid;
    const velSum = new THREE.Vector3();
    let count = 0;

    for (let i = 0, il = boids.length; i < il; i++) {
      if (Math.random() > 0.6) continue;

      boid = boids[i];

      const distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {
        velSum.add(boid.velocity);
        count++;
      }
    }

    if (count > 0) {
      velSum.divideScalar(count);

      const l = velSum.length();

      if (l > _maxSteerForce) {
        velSum.divideScalar(l / _maxSteerForce);
      }
    }

    return velSum;
  };

  this.cohesion = function (boids) {
    let boid;
    let distance;
    const posSum = new THREE.Vector3();
    const steer = new THREE.Vector3();
    let count = 0;

    for (let i = 0, il = boids.length; i < il; i++) {
      if (Math.random() > 0.6) continue;

      boid = boids[i];
      distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {
        posSum.add(boid.position);
        count++;
      }
    }

    if (count > 0) {
      posSum.divideScalar(count);
    }

    steer.subVectors(posSum, this.position);

    const l = steer.length();

    if (l > _maxSteerForce) {
      steer.divideScalar(l / _maxSteerForce);
    }

    return steer;
  };

  this.separation = function (boids) {
    let boid;
    let distance;
    const posSum = new THREE.Vector3();
    const repulse = new THREE.Vector3();

    for (let i = 0, il = boids.length; i < il; i++) {
      if (Math.random() > 0.6) continue;

      boid = boids[i];
      distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {
        repulse.subVectors(this.position, boid.position);
        repulse.normalize();
        repulse.divideScalar(distance);
        posSum.add(repulse);
      }
    }

    return posSum;
  };
};

export default Boid;
