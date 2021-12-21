import { AABB } from "./quadtree.js";
import { Vec2 } from "./vec2.js";

export class Body extends AABB {

  constructor(shape) {
    super();
    // shape instance
    this.shape = shape.copy();
    this.shape.body = this;
    // initialize
    this.position = new Vec2();
    this.velocity = new Vec2();
    this.force = new Vec2();
    this.restitution = 0.2;
  }

  setForce(x, y) {
    this.force.set(x, y);
    return this;
  }

  setVelocity(x, y) {
    this.velocity.set(x, y);
    return this;
  }

  setRestitution(r) {
    this.restitution = r;
    return this;
  }
  
}
