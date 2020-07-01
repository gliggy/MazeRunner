var myCanvas = document.getElementById('myCanvas');
myCanvas.width = window.innerWidth - 20;            // fill the entire browser width
myCanvas.height = window.innerHeight - 70;          // fill the entire browser height

var ctx = myCanvas.getContext("2d"); // Get the drawing context for the canvas
 var FPS = 40;                        // How many frames per second
 var Quickness = 6;                   // How quick the hero goes (isn't working right now)
var canMoveUp = true;
var canMoveDown = true;
var canMoveRight = true;
var canMoveLeft = true;
var nextLevel = false;
var levelNumber = 0;
var levelsLeft = 3;
var lives = 5;
var lastDeathTime = 0;

//audio
var wall = new Audio("hitWall.wav");
var levelUp = new Audio("nextLevel.wav");
var hitEnemy = new Audio("hitEnemy.wav");
var bgMusic = new Audio("bgMusic.mp3");
 
bgMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
bgMusic.play();
bgMusic.volume = 0.4;

class World {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
  }
}

class Mover {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.xStart = x;
    this.yStart = y;
  }
  draw(world) {
    world.ctx.drawImage(this.img, this.x + world.x - 32, this.y + world.y - 32, 64, 64);
  }
  chase(target) {
    var dx = target.x - this.x;
    var dy = target.y - this.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    if (length < 1000) {
      this.x += 3 * dx / length;
      this.y += 3 * dy / length;
    }
    if (length < 50 && Date.now() - 2000 > lastDeathTime) {
      lives -= 1;
      lastDeathTime = Date.now();
      
    }
    if (lives == 0) {noLives();}
  }
  getDimensions() {
    return [64, 64];
  }
  reset() {
    this.x = this.xStart;
    this.y = this.yStart;
  }
} 

class Sensor {
  constructor(x, y, mover, world) {
    this.x = x;
    this.y = y;
    this.mover = mover;
    this.world = world;
  }
  getPixel() {
    var result = this.world.ctx.getImageData(this.mover.x + this.x + world.x, this.mover.y + this.y + world.y, 1, 1).data;
    //console.log(result, this);
    return result;
  }
  isWall() {
    return this.getPixel()[1] === 255;
  }
}

class Sensors {
  constructor(mover, world) {
    this.mover = mover;
    this.world = world;
    var [dx, dy] = this.mover.getDimensions();
    dx /= 2;
    dy /= 2;
    var points = [[-dx, -dy], [0, -dy], [dx, -dy], [dx, 0], [dx, dy], [0, dy], [-dx, dy], [-dx, 0]];
    this.sensors = [];
    for(var point of points) {
      this.sensors.push(new Sensor(point[0], point[1], this.mover, this.world));
    }
  }
  isWall() {
    return this.sensors.some(sensor => sensor.isWall());
  }
}

var world = new World(ctx, 6000, 3000);
var enemyCostume = new Image();
enemyCostume.src = "enemy.png";
var enemies = [];
for (var i = 0; i < 10; i ++){
  var x = Math.random() * world.width;
  var y = Math.random() * world.height;
  enemies.push(new Mover(x, y, enemyCostume));
} 
var heroCostume = new Image();
heroCostume.src = "character.png";
var hero = new Mover(myCanvas.width / 2, myCanvas.height / 2, heroCostume); 
var haveEnemies = false;
var heroSensors = new Sensors(hero, world);

function showEnemies () {
  if (haveEnemies) {
    haveEnemies = false;
    document.getElementById("enemyButton").value="Play With Enemies";
  } else {
    haveEnemies = true;
    document.getElementById("enemyButton").value="Play Without Enemies";
    }
}

 function MySprite (img_url) {
        this.x = 0;
        this.y = 0;
        this.visible= true;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.MyImg = new Image();
        this.MyImg.src = img_url ;

        }


    MySprite.prototype.Do_Frame_Things = function() {

      // apply velocities
      if(heroSensors.isWall()) {
	wall.play();
      }  
      var factor = 2.5;
      if (this.velocity_x < 0) {
       if (canMoveRight) {
         hero.x += this.velocity_x * factor;
       } else {
         //wall.play();
       }
      }
      if (this.velocity_x > 0) {
       if (canMoveLeft) {
         hero.x += this.velocity_x * factor;
       } else {
         //wall.play();
       }
      }
      if (this.velocity_y < 0) {
       if (canMoveDown) {
         hero.y += this.velocity_y * factor;
       } else {
         //wall.play();
       }
      }
      if (this.velocity_y > 0) {
       if (canMoveRight) {
         hero.y += this.velocity_y * factor;
       } else {
         //wall.play();
       }
      }
	var space = 60;
	var cx = myCanvas.width / 2 - world.x;
	var cy = myCanvas.height / 2 - world.y;
	if (Math.abs(hero.x - cx) > space) {
	  var dx = (Math.abs(hero.x - cx) - space) * Math.sign(hero.x - cx);
	  this.x -= dx;
	  hero.x -= dx;
	} else { 
	  var dx = (hero.x - cx)/4;
	  this.x -= dx;
	  hero.x -= dx;
	}
	if (Math.abs(hero.y - cy) > space) {
	  var dy = (Math.abs(hero.y - cy) - space) * Math.sign(hero.y - cy);
	  this.y -= dy;
	  hero.y -= dy;
	} else {
	  var dy = (hero.y - cy)/4;
	  this.y -= dy;
	  hero.y -= dy;
	}

	world.x = this.x;
	world.y = this.y;
  
        if (this.visible){ 
	  ctx.imageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.mozImageSmoothingEnabled = false;
          ctx.drawImage(this.MyImg, this.x, this.y, 6000, 3000); // draw the maze
	   var imageWidth = MySprite.width;
	   var imageHeight = MySprite.height;
          }
        }



var maze;

var character = new Image();
character.src = "character.png";

var drawTimer = null;

function stopLevel() {
  if (drawTimer) {
    clearInterval(drawTimer);
    drawTimer = null;
  }
}

function startLevel() {
  levelNumber += 1;
  stopLevel();
  levelUp.play();
  maze = new MySprite("maze" + levelNumber + ".png"); // The mazes
  world.x = maze.x;
  world.y = maze.y;
  hero.reset();
  drawTimer = setInterval(Do_a_Frame, 1000/FPS);                  // set my frame renderer
}

function backLevel() {
  levelNumber = 0;
  stopLevel();
  maze = MySprite("maze1.png");
  startLevel();
}

function endLevel() {
  if (levelsLeft > 0){
    startLevel();
  } else {
    stopLevel();
    var answer = prompt("You ran out of levels, but you can make your own. Answer 'yes' if you want to, or 'no' if you don't.");
    if (answer == "yes") { window.open("https://gliggy.github.io/MazeRunner/paint.html", "_self"); }
    else alert("OK");
  }
}

function noLives() {
  stopLevel();
  alert("You have died.");
  backLevel();
  lives = 5;
}

function Do_a_Frame () {
  var cw = 64;
  var ch = 64;
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);     // clear the background
    maze.Do_Frame_Things();                                   // maze
  var Data = ctx.getImageData(hero.x + world.x, hero.y + world.y, 1, 1).data;  
  var upData = ctx.getImageData(hero.x + world.x, hero.y + world.y - (ch / 2) - 3, 1, 1).data;
  var downData = ctx.getImageData(hero.x + world.x, hero.y + world.y + (ch / 2) + 3, 1, 1).data;
  var rightData = ctx.getImageData(hero.x + world.x + (cw / 2) + 3, hero.y + world.y, 1, 1).data;
  var leftData = ctx.getImageData(hero.x + world.x - (cw / 2) - 3, hero.y + world.y, 1, 1).data;
  canMoveDown = (upData[1] != 255);
  canMoveUp = (downData[1] != 255);
  canMoveLeft = (rightData[1] != 255);
  canMoveRight = (leftData[1] != 255);
  nextLevel = (Data[1] == 250);
  if (nextLevel) {
    endLevel();
    levelsLeft -= 1;
  }
  hero.draw(world);
  //ctx.drawImage(character, (myCanvas.width / 2) - (cw / 2) + hero.x, (myCanvas.height / 2) - (ch / 2) + hero.y, cw, ch);
  
    // draws character in the center of the screen
    if (haveEnemies) {
      for (var enemy of enemies) {
        enemy.draw(world);
        enemy.chase(hero);
      }
    }
    ctx.fillStyle= "red";
    ctx.font="20px arial";
    ctx.fillText("You are on level " + levelNumber + ".", 5, 20); // show level
    ctx.fillText("You have " + lives + " lives left.", 5, 50);
    }




function MyKeyUpHandler (MyEvent) { 
   if (MyEvent.keyCode == 37 || MyEvent.keyCode == 39) {maze.velocity_x= 0}; // not left or right
   if (MyEvent.keyCode == 38 || MyEvent.keyCode == 40) {maze.velocity_y= 0}; // not up or down
   }


function MyKeyDownHandler (MyEvent) {
  //console.log("can go", canMoveUp, canMoveDown);
   if (MyEvent.keyCode == 37 && canMoveRight == true) {maze.velocity_x = -Quickness}; // left
   if (MyEvent.keyCode == 38 && canMoveDown == true) {maze.velocity_y = -Quickness};  // up
   if (MyEvent.keyCode == 39 && canMoveLeft == true) {maze.velocity_x = Quickness};   // right
   if (MyEvent.keyCode == 40 && canMoveUp == true) {maze.velocity_y = Quickness};     // down
   MyEvent.preventDefault();
   } 


function MyTouchHandler (MyEvent) { 
   var rect = myCanvas.getBoundingClientRect();           // where is our canvas
   maze.velocity_y= 0; 
   maze.velocity_x= 0;                                    // zero out velocity

   for (var i=0; i < MyEvent.touches.length; i++) {
       var x = MyEvent.touches[i].clientX - rect.left;    // get x & y coords
       var y = MyEvent.touches[i].clientY - rect.top;     // relative to canvas

       // Add velocity depending on which thirds we see touch

       if (x > myCanvas.width * 0.66) maze.velocity_x = maze.velocity_x + Quickness;  
       if (x < myCanvas.width * 0.33) maze.velocity_x = maze.velocity_x - Quickness;  
       if (y > myCanvas.height * 0.66) maze.velocity_y = maze.velocity_y + Quickness; 
       if (y < myCanvas.height * 0.33) maze.velocity_y = maze.velocity_y - Quickness; 
       }

   MyEvent.preventDefault();   
   }

 addEventListener("keydown", MyKeyDownHandler);           // listen for keystrokes  
 addEventListener("keyup", MyKeyUpHandler);               // listen for keys released
 myCanvas.addEventListener("touchstart", MyTouchHandler);                
 myCanvas.addEventListener("touchmove", MyTouchHandler);  // listen for anything about touches
 myCanvas.addEventListener("touchend", MyTouchHandler);    
startLevel();


