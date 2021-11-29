import { COLLISIONS } from "./collision.js";
import { Vec2 } from "./vec2.js";

export class Pair {

    static tmp = new Vec2();

    constructor() {
        this.a = null;
        this.b = null;
        this.normal = new Vec2();
        this.penetration = 0;
    }

    handleCollision(a, b) {
        this.a = a;
        this.b = b;  
        const collisionIndex = (a.shape.getType() << 1) + b.shape.getType();
        return COLLISIONS[collisionIndex].collision(a, b, this);
    }

    solveCollision() {

        const { a, b } = this;

        // Correct velocities        
		const diff = Pair.tmp.set(b.velocity).sub(a.velocity);

		const av = diff.dot(this.normal); // accumulated velocity
		if(av < 0) {
            const j = (1 + Math.min(a.restitution, b.restitution)) * av / (a.invMass + b.invMass);	  
            a.velocity.addScl(this.normal,  a.invMass * j);
            b.velocity.addScl(this.normal, -b.invMass * j);
        }		

        // Correct position
        let p = this.penetration * 0.8 / (a.invMass + b.invMass);
        a.position.addScl(this.normal, -this.a.invMass * p);
        b.position.addScl(this.normal,  this.b.invMass * p);

    }

}