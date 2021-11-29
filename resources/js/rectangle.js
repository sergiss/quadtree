import { Shape } from "./shape.js";

export class Rectangle extends Shape {

    constructor(halfWidth = 0.5, halfHeight = halfWidth, color = '#da532c') {
        super();
        this.halfWidth  = halfWidth;
        this.halfHeight = halfHeight;  
        this.color = color;
    }

    copy() {
        return new Rectangle(this.halfWidth, this.halfHeight, this.color);
    }

    getType() {
        return Shape.RECTANGLE;
    }

    render(ctx) {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        const position = this.body.position;
        ctx.rect(position.x - this.halfWidth, 
                 position.y - this.halfHeight, 
                 this.halfWidth  * 2.0, 
                 this.halfHeight * 2.0);
        ctx.stroke();
    }

    updateBounds() {
        this.body.min.set(this.body.position).sub(this.halfWidth, this.halfHeight);
        this.body.max.set(this.body.position).add(this.halfWidth, this.halfHeight);
    }

}