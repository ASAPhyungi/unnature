let bigCircle;
let smallCircles = [];
let attractorStrength = 0.05; 
let repulsionStrength = 0.5; 
let maxSmallCircles = 50; 

function setup() {
  createCanvas(800, 600);
  bigCircle = new BigCircle();
}

function draw() {
  background(20, 20, 40);

  bigCircle.update();
  bigCircle.checkEdges();
  bigCircle.display();

  for (let i = smallCircles.length - 1; i >= 0; i--) {
    let sc = smallCircles[i];

    let attraction = p5.Vector.sub(bigCircle.position, sc.position);
    attraction.setMag(attractorStrength);
    sc.applyForce(attraction);

    for (let j = smallCircles.length - 1; j >= 0; j--) {
      let other = smallCircles[j];
      if (sc !== other) {
        let distance = p5.Vector.dist(sc.position, other.position);
        if (distance < sc.r + other.r) {
          let repulsion = p5.Vector.sub(sc.position, other.position);
          repulsion.setMag(repulsionStrength / distance); 
          sc.applyForce(repulsion);
        }
      }
    }

    sc.update();
    sc.display();

  }
}

function mousePressed() {
  if (smallCircles.length < maxSmallCircles) {
    smallCircles.push(new SmallCircle(mouseX, mouseY));
  }
}


class BigCircle {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(3); // 초기 속도
    this.r = 30;
    this.color = color(255, 100, 100);
  }

  update() {
    let randomWalkForce = p5.Vector.random2D();
    randomWalkForce.mult(0.5); 
    this.velocity.add(randomWalkForce);
    this.velocity.limit(5); 

    this.position.add(this.velocity);
  }

  checkEdges() {
    if (this.position.x > width - this.r) {
      this.position.x = width - this.r;
      this.velocity.x *= -1;
    } else if (this.position.x < this.r) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    }
    if (this.position.y > height - this.r) {
      this.position.y = height - this.r;
      this.velocity.y *= -1;
    } else if (this.position.y < this.r) {
      this.position.y = this.r;
      this.velocity.y *= -1;
    }
  }

  display() {
    noStroke();
    fill(this.color, 150);
    ellipse(this.position.x, this.position.y, this.r * 2);

    stroke(255, 200, 0);
    strokeWeight(2);
    line(this.position.x, this.position.y, this.position.x + this.velocity.x * 5, this.position.y + this.velocity.y * 5);
  }
}

class SmallCircle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = 8;
    this.mass = this.r * 0.1; 
    this.color = color(100, 200, 255);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(4); 
    this.position.add(this.velocity);
    this.acceleration.mult(0); 

    if (this.position.x > width - this.r) {
      this.position.x = width - this.r;
      this.velocity.x *= -0.5; 
    } else if (this.position.x < this.r) {
      this.position.x = this.r;
      this.velocity.x *= -0.5;
    }
    if (this.position.y > height - this.r) {
      this.position.y = height - this.r;
      this.velocity.y *= -0.5;
    } else if (this.position.y < this.r) {
      this.position.y = this.r;
      this.velocity.y *= -0.5;
    }
  }

  display() {
    noStroke();
    fill(this.color, 180);
    ellipse(this.position.x, this.position.y, this.r * 2);
  }
}