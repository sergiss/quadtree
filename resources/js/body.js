import { AABB } from "./quadtree.js";
import { Vec2 } from "./vec2.js";

export class Body extends AABB {

  constructor(shape) {
    super();
    // shape instance
    this.shape = shape.copy();
    this.shape.body = this;
    // initialize
    this.tmp = new Vec2();
    this.position = new Vec2();
    this.velocity = new Vec2();
    this.force = new Vec2();
    this.restitution = 0.2;
  }

  setForce(x, y) {
    if(x instanceof Vec2) {
      y = x.y;
      x = x.x;
    }
    this.force.set(x, y);
    return this;
  }

  setVelocity(x, y) {
    if(x instanceof Vec2) {
      y = x.y;
      x = x.x;
    }
    this.velocity.set(x, y);
    return this;
  }

  setRestitution(r) {
    this.restitution = r;
    return this;
  }
  
}
