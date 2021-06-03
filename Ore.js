class Ore extends Block {
  constructor(x, y, type = "gold") {
    super(x, y);
    this.type = type;
  }

  show() {
    push();
    strokeWeight(0.75);

    translate(w * (this.pos.x + 0.5), w * (this.pos.y + 0.5));

    noStroke();
    rectMode(CENTER);

    fill(125);
    circle(0, 0, w * 0.65);
    square(0, 0, w * 0.55);

    fill(this.getTypeColor());
    // if (this.type === "gold") fill(230, 210, 15);
    // else if (this.type === "iron") fill(190, 75, 20);
    // else if (this.type === "stone") fill(85);

    rotate(PI / 5);
    square(0, 0, w * 0.5);
    rotate(PI / 3);
    square(0, 0, w * 0.475);
    fill(125);
    rotate((2 * PI) / 5);
    rect(0, 0, w * 0.425);
    circle(0, 0, w * 0.475);
    pop();
  }

  getTypeColor() {
    if (this.type === "gold") return "#e6d20f";
    else if (this.type === "iron") return "#be4b14";
    else if (this.type === "stone") return "#555555";
  }
}
