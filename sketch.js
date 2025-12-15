let redBigCircle, blueBigCircle;
let redSmallCircles = [];
let blueSmallCircles = [];
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

  redBigCircle = new BigCircle(width * 0.3, height * 0.5);
  blueBigCircle = new BigCircle(width * 0.7, height * 0.5);
}

function draw() {
  background(20, 20, 40);

  redBigCircle.update();
  redBigCircle.checkEdges();
  
  updateSwarm(redSmallCircles, redBigCircle);

  blueBigCircle.update();
  blueBigCircle.checkEdges();

  updateSwarm(blueSmallCircles, blueBigCircle);
  for (let dot of dots) {
    dot.checkCollision(redBigCircle, redSmallCircles, blueBigCircle, blueSmallCircles);
    dot.display();
  }
}
function updateSwarm(swarmArray, attractor) {
  for (let i = swarmArray.length - 1; i >= 0; i--) {
    let sc = swarmArray[i];

    let attraction = p5.Vector.sub(attractor.position, sc.position);
    attraction.setMag(attractorStrength);
    sc.applyForce(attraction);

    for (let j = swarmArray.length - 1; j >= 0; j--) {
      let other = swarmArray[j];
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
}

function mousePressed() {
  let choice = random(1);

  if (choice < 0.5) {
    if (redSmallCircles.length < maxSmallCircles) {
      redSmallCircles.push(new SmallCircle(mouseX, mouseY));
    }
  } else {
    if (blueSmallCircles.length < maxSmallCircles) {
      blueSmallCircles.push(new SmallCircle(mouseX, mouseY));
    }
  }
}


class Dot {
  constructor(x, y, r) {
    this.position = createVector(x, y);
    this.r = r;
    this.baseColor = color(255);
    this.redColor = color(255, 50, 50);
    this.blueColor = color(50, 100, 255);
    this.mixColor = color(200, 50, 200);
    this.currentColor = this.baseColor;
  }

  checkCollision(redBig, redSmalls, blueBig, blueSmalls) {
    let touchedRed = false;
    let touchedBlue = false;

    if (dist(this.position.x, this.position.y, redBig.position.x, redBig.position.y) < this.r + redBig.r) {
      touchedRed = true;
    } else {
      for (let sc of redSmalls) {
        if (dist(this.position.x, this.position.y, sc.position.x, sc.position.y) < this.r + sc.r) {
          touchedRed = true;
          break;
        }
      }
    }
    if (dist(this.position.x, this.position.y, blueBig.position.x, blueBig.position.y) < this.r + blueBig.r) {
      touchedBlue = true;
    } else {
      for (let sc of blueSmalls) {
        if (dist(this.position.x, this.position.y, sc.position.x, sc.position.y) < this.r + sc.r) {
          touchedBlue = true;
          break;
        }
      }
    }

    if (touchedRed && touchedBlue) {
      this.currentColor = this.mixColor;
    } else if (touchedRed) {
      this.currentColor = this.redColor;
    } else if (touchedBlue) {
      this.currentColor = this.blueColor;
    } else {
      this.currentColor = this.baseColor;
    }
  }

  display() {
    noStroke();
    fill(this.currentColor);
    ellipse(this.position.x, this.position.y, this.r * 2);
  }
}

class BigCircle {
  constructor(x, y) {
    this.position = createVector(x, y);
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