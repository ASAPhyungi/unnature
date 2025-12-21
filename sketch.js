let redGroup, blueGroup;
let grid;

function setup() {
  createCanvas(600, 600);
  
  redGroup = new SwarmGroup(width * 0.3, height * 0.5, color(255, 50, 50));
  blueGroup = new SwarmGroup(width * 0.7, height * 0.5, color(50, 100, 255));
  grid = new Grid(15); 
}

function draw() {
  background(20, 20, 40);

  redGroup.update();
  blueGroup.update();
  grid.display(redGroup, blueGroup);
}

function mousePressed() {
  if (random(1) < 0.5) {
    redGroup.addParticle(mouseX, mouseY);
  } else {
    blueGroup.addParticle(mouseX, mouseY);
  }
}