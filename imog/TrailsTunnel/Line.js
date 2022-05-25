import _ from 'underscore';
import * as THREE from 'three';

import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';

export default class Line {
  constructor({ position = new THREE.Vector3(), color = new THREE.Color(255, 255, 255), tunnelLength = 100 } = {}) {
    this.position = position;
    this.origin = position.clone();
    this.tunnelLength = tunnelLength;
    this.velocity = Math.random() > 0.5 ? 0.1 : 0.25;

    this.positions = _.flatten(_.range(5).map((i) => [this.position.x - i * 0.2, this.position.y, this.position.z]));

    this.geometry = new LineGeometry();
    this.geometry.setPositions(this.positions);

    this.material = new LineMaterial({
      color,
      worldUnits: true,
      linewidth: 0.02,
      vertexColors: false,
      dashed: false,
      alphaToCoverage: false,
    });
    this.material.resolution.set(innerWidth, innerHeight);

    this.mesh = new Line2(this.geometry, this.material);
    this.mesh.computeLineDistances();
    this.mesh.scale.set(1, 1, 1);
  }

  tick(dt) {
    this.position.x += this.velocity * dt;

    if (this.position.x > this.tunnelLength / 2) {
      this.position.copy(this.origin);
      this.positions = _.flatten(_.range(5).map((i) => [this.position.x - i * 0.2, this.position.y, this.position.z]));
    }

    this.positions.unshift(this.position.x, this.position.y, this.position.z);
    this.positions.pop();
    this.positions.pop();
    this.positions.pop();
    this.geometry.setPositions(this.positions);
  }
}
