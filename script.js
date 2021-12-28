let balls =[];

const canvas = document.querySelector('canvas');
const ct = canvas.getContext('2d');

canvas.height = window.innerHeight; // gets height of the screen
canvas.width = window.innerWidth; // gets width of the screen

// Randomly generates interger for position
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }

// Randomly generates interger for color
function getRandomColor() {
    let r = getRandomInt(0, 255);
    let g = getRandomInt(0, 255);
    let b = getRandomInt(0, 255);
    let a = Math.random() * (1 - 0.5) + 0.5;
  
    return `rgb(${r}, ${g}, ${b}, ${a})`;
  }  

  // Randomly generates interger for position
  function getDirection() {
    return Math.random() > 0.5 ? 1 : -1;
  }

  // Calculates distance
  function getDistance(x1, y1, x2, y2) {
    return (x2 - x1) ** 2 + (y2 - y1) ** 2;
  }

  // Generates multiple balls
function multiBalls(numBalls) {
    for(let i=0; i<numBalls; i++){
        let radius = getRandomInt(5, 20);
        let x = getRandomInt(radius, canvas.width - radius);
        let y = getRandomInt(radius, canvas.height - radius);
        let dx = getDirection();
        let dy = getDirection();
        let color = getRandomColor();

        // Detects collision while drawing the ball 
        if (i !== 0) {
            for (let j = 0; j < i; j++) {
              let dis = getDistance(x, y, balls[j].x, balls[j].y);
              if (dis <= (radius + balls[j].radius) ** 2) {
                x = getRandomInt(radius, canvas.width - radius);
                y = getRandomInt(radius, canvas.height - radius);
                j = -1;
              }
            }
          }

        let myBalls = new Balls(x, y, dx, dy, radius, color)
        balls.push(myBalls);
    }    
}

class Balls{
    constructor(x, y, dx, dy , radius, color){
        this.x=x;
        this.y=y;
        this.dx=dx;
        this.dy=dy;
        this.radius=radius;
        this.color=color;
    }
    
    // Detects collision with walls
    detectWallCollision() {
        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0)
          this.dx = -this.dx;
        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0)
          this.dy = -this.dy;
      };

      // Bounce Back after colliding with another ball
      bounceBack = (secondBall) => {
        let vecCollision = { x: this.x - secondBall.x, y: this.y - secondBall.y }; //creating a vector for the collision that took place
        let distance = Math.sqrt(getDistance(this.x, this.y, secondBall.x, secondBall.y)); //the distance of the collision vector
    

        // normalized collision vector
        let normVector = {
          x: vecCollision.x / distance,
          y: vecCollision.y / distance,
        };
        
        // relative velocity of the
        let relVelocity = {
          x: this.dx - secondBall.dx,
          y: this.dy - secondBall.dy,
        };
        
        // the speed of the collision
        let speed = relVelocity.x * normVector.x + relVelocity.y * normVector.y;
    
        this.dx -= speed * normVector.x;
        this.dy -= speed * normVector.y;
        secondBall.dx += speed * normVector.x;
        secondBall.dy += speed * normVector.y;
      };

      // Detects collision with another ball
      detectBallColiisions(){
        for (let k = 0; k < balls.length; k++) {
            if (this === balls[k]) continue;
      
            if (getDistance
                (
                    this.x, this.y, balls[k].x, balls[k].y) <=
                        (this.radius + balls[k].radius) ** 2
                ) {
                    this.bounceBack(balls[k]);

                 }
            }
        }
    
    // generates the ball  
    draw(){
        ct.beginPath();
        ct.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ct.fillStyle = this.color;
        ct.fill();
        ct.closePath();
    };

    // moves the ball
    move(){
        this.detectWallCollision();
        this.detectBallColiisions();
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    
    };
    
}

// RequestAnimationFrame 
function animate(){
    requestAnimationFrame(animate);
    ct.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((myBalls) => myBalls.move());
    
}

// Passing the number of balls
multiBalls(500);
animate();

  
  
  
  
  