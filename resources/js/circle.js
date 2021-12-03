import { Shape } from "./shape.js";

export class Circle extends Shape {

    constructor(radius = 1, color) {
        super(color);
        this.radius = radius;
    }

    copy() {
        return new Circle(this.radius, this.color);
    }

    getType() {
        return Shape.CIRCLE;
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        let position = this.body.position;
        ctx.arc(position.x, 
                position.y, 
                this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    updateBounds() {
        this.body.min.set(this.body.position).sub(this.radius);
        this.body.max.set(this.body.position).add(this.radius);
    }

}