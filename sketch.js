let bigCircle;
let smallCircles = [];
let dots = []; 


let attractorStrength = 0.05;
let repulsionStrength = 0.5;
let maxSmallCircles = 50;

function setup() {
  createCanvas(600, 600);

  let dotRadius = 3; 
  let gap = 15;     

  for (let y = gap / 2; y < height; y += gap) {
    for (let x = gap / 2; x < width; x += gap) {
      dots.push(new Dot(x, y, dotRadius));
    }
  }

  bigCircle = new BigCircle();
}

function draw() {
  background(20, 20, 40);


  bigCircle.update();
  bigCircle.checkEdges();

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

  }

  for (let dot of dots) {
    dot.checkCollision(bigCircle, smallCircles); 
    dot.display(); 
  }
}

function mousePressed() {
  if (smallCircles.length < maxSmallCircles) {
    smallCircles.push(new SmallCircle(mouseX, mouseY));
  }
}


class Dot {
  constructor(x, y, r) {
    this.position = createVector(x, y);
    this.r = r;
    this.baseColor = color(255);
    this.activeColor = color(255, 50, 50); 
    this.currentColor = this.baseColor;
  }

  checkCollision(bigC, smallCs) {
    this.currentColor = this.baseColor;

    let dBig = dist(this.position.x, this.position.y, bigC.position.x, bigC.position.y);
    

    if (dBig < this.r + bigC.r) {
      this.currentColor = this.activeColor;
      return; 
    }

    for (let sc of smallCs) {
      let dSmall = dist(this.position.x, this.position.y, sc.position.x, sc.position.y);
      if (dSmall < this.r + sc.r) {
        this.currentColor = this.activeColor;
        break; 
      }
    }
  }

  display() {
    noStroke();
    fill(this.currentColor);
    ellipse(this.position.x, this.position.y, this.r * 2);
  }
}

class BigCircle {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(3);
    this.r = 40; 
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
  

}

class SmallCircle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = 15; 
    this.mass = this.r * 0.1;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(6);
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
}