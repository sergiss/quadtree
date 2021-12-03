export class Shape {

  static {
    Shape.RECTANGLE = 0;
    Shape.CIRCLE = 1;
  }

  constructor(color = this.rndColor()) {
    this.color = color;
   }

  rndColor() {
    const hex = '0123456789ABCDEF';
    let i, result = '#';
    for (i = 0; i < 6; i++) {
      result += hex[Math.floor(Math.random() * hex.length)];
    }
    return result;
  }
  
  copy() {
    throw new Error("Unimplemented method!");
  }

  getType() {
    throw new Error("Unimplemented method!");
  }

  render(ctx) {
    throw new Error("Unimplemented method!");
  }

  updateBounds() {
    throw new Error("Unimplemented method!");
  }

}
