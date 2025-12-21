class Grid {
  constructor(gap) {
    this.dots = [];
    this.gap = gap;
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) {
        this.dots.push({ pos: createVector(x, y), r: 3 });
      }
    }
  }

  display(groupA, groupB) {
    noStroke();
    for (let d of this.dots) {
      let touchA = groupA.isTouching(d.pos, d.r);
      let touchB = groupB.isTouching(d.pos, d.r);

      if (touchA && touchB) fill(200, 50, 200);
      else if (touchA) fill(groupA.color);
      else if (touchB) fill(groupB.color);
      else fill(255, 50);

      ellipse(d.pos.x, d.pos.y, d.r * 2);
    }
  }
}