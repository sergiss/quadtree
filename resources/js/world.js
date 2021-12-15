import { Body } from "./body.js";
import { Pair } from "./pair.js";
import { AABB, Quadtree } from "./quadtree.js";
import { Vec2 } from "./vec2.js";

export class World {
  constructor(gravity = new Vec2(0, 0)) {
    this.gravity = gravity;

    this.bodies = [];
    this.quadtree = new Quadtree(new AABB(new Vec2(), new Vec2(2000, 2000)));
  }

  step(dt) {
    this.pairs = [];
    this.quadtree.clear();

    let a, i, j;
    // Update
    for (i = 0; i < this.bodies.length; ++i) {
      a = this.bodies[i];
      if (a.invMass !== 0) {
        a.velocity.scl(0.9998); // Air friction
        a.velocity.addScl(this.gravity, dt);
        a.velocity.addScl(a.force, dt);
        a.force.setZero();
        a.position.add(a.velocity);
      }
      a.shape.updateBounds();
      this.quadtree.insert(a);
    }

    // Check collisions

    for (i = 0; i < this.bodies.length; ++i) {
      a = this.bodies[i];
      this.quadtree.iterate(a, (b)=> {
        if (b !== a && b.invMass + a.invMass !== 0) {
          let pair = new Pair();
          if (pair.handleCollision(a, b)) {
            this.pairs.push(pair);
          }
        }
      });
    }

    // Solve Collisions
    for (i = 0; i < this.pairs.length; ++i) {
      const pair = this.pairs[i];
      pair.solveCollision();
    }
  }

  createBody(shape, x = 0, y = 0, mass = 1) {
    const body = new Body(shape);
    body.invMass = mass ? 1.0 / mass : 0;
    body.position.set(x, y);
    this.add(body);
    return body;
  }

  add(body) {
    this.bodies.push(body);
    body.world = this;
  }

  removeAll(bodies) {
    for (let i = 0; i < bodies.length; ++i) {
      this.remove(bodies[i]);
    }
  }

  remove(body) {
    const index = this.bodies.indexOf(body);
    if (index > -1) {
      this.bodies.splice(index, 1);
      return true;
    }
    return false;
  }

  clear() {
    this.bodies = [];
  }

  forEach = (iterator) => {
    for (let i = 0; i < this.bodies.length; ++i) {
      iterator(this.bodies[i]);
    }
  };

  render(ctx, debug) {
    if (debug) {
      ctx.strokeStyle = "#fff";
      this.quadtree.debug(ctx);
    }
    for (let i = 0; i < this.bodies.length; ++i) {
      this.bodies[i].shape.render(ctx);
    }
  }
}
