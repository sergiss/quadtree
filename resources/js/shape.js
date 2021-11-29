export class Shape {

  static {
    Shape.RECTANGLE = 0;
    Shape.CIRCLE = 1;
  }

  constructor() { }
  
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
