var myCanvas = document.getElementById('myCanvas');

var ctx = myCanvas.getContext("2d"); // Get the drawing context for the canvas
 var FPS = 40;                        // How many frames per second
 var Quickness = 6;                   // How quick he goes, when he's going
var canMoveUp = true
var canMoveDown = true
var canMoveRight = true
var canMoveLeft = true
var nextLevel = false
var levelNumber = 0
var levelsLeft = 3
var x_char = 0;
var y_char = 0;

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

        if ((this.velocity_x<0 && canMoveRight == true)) x_char += this.velocity_x; //left velocity
        if ((this.velocity_x>0 && canMoveLeft == true)) x_char += this.velocity_x;  //right velocity
        if ((this.velocity_y<0 && canMoveDown == true)) y_char +=  this.velocity_y;  //up velocity
        if ((this.velocity_y>0 && canMoveUp == true)) y_char += this.velocity_y;     //down velocity
	var space = 40;
	if (Math.abs(x_char) > space) {
	  var dx = (Math.abs(x_char) - space) * Math.sign(x_char);
	  this.x -= dx;
	  x_char -= dx;
	} 
	if (Math.abs(y_char) > space) {
	  var dy = (Math.abs(y_char) - space) * Math.sign(y_char);
	  this.y -= dy;
	  y_char -= dy;
	} 

  
        if (this.visible){ 
	  ctx.imageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.mozImageSmoothingEnabled = false;
          ctx.drawImage(this.MyImg, this.x, this.y, 6000, 3000); // draw the maze
	   var imageWidth = MySprite.width
	   var imageHeight = MySprite.height
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
  maze = new MySprite("maze" + levelNumber + ".png"); // The mazes
  drawTimer = setInterval(Do_a_Frame, 1000/FPS);                  // set my frame renderer
}

function backLevel() {
  levelNumber == 1;
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

function Do_a_Frame () {
  var cw = 64;
  var ch = 64;
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);     // clear the background
    maze.Do_Frame_Things();                                   // maze
  var Data = ctx.getImageData(x_char + myCanvas.width / 2, y_char + myCanvas.height / 2, 1, 1).data;  
  var upData = ctx.getImageData(x_char + myCanvas.width / 2, y_char + (myCanvas.height / 2) - (ch / 2) - 3, 1, 1).data;
  var downData = ctx.getImageData(x_char + myCanvas.width / 2, y_char + (myCanvas.height / 2) + (ch / 2) + 3, 1, 1).data;
  var rightData = ctx.getImageData(x_char + myCanvas.width / 2 + (cw / 2) + 3, y_char + (myCanvas.height / 2), 1, 1).data;
  var leftData = ctx.getImageData(x_char + myCanvas.width / 2 - (cw / 2) - 3, y_char + (myCanvas.height / 2), 1, 1).data;
  canMoveDown = (upData[1] != 255);
  canMoveUp = (downData[1] != 255);
  canMoveLeft = (rightData[1] != 255);
  canMoveRight = (leftData[1] != 255);
  nextLevel = (Data[1] == 250);
  if (nextLevel) {
    endLevel();
    levelsLeft -= 1
  }
  ctx.drawImage(character, (myCanvas.width / 2) - (cw / 2) + x_char, (myCanvas.height / 2) - (ch / 2) + y_char, cw, ch);
    // draws character in the center of the screen
    ctx.fillStyle= "red";
    ctx.font="20px arial";
    ctx.fillText("You are on level " + levelNumber + ".", 0, 20); // show level
    }




function MyKeyUpHandler (MyEvent) { 
   if (MyEvent.keyCode == 37 || MyEvent.keyCode == 39) {maze.velocity_x= 0}; // not left or right
   if (MyEvent.keyCode == 38 || MyEvent.keyCode == 40) {maze.velocity_y= 0}; // not up or down
   }


function MyKeyDownHandler (MyEvent) {
  //console.log("can go", canMoveUp, canMoveDown);
   if (MyEvent.keyCode == 37 && canMoveRight == true) {maze.velocity_x=   -Quickness};   // left
   if (MyEvent.keyCode == 38 && canMoveDown == true) {maze.velocity_y=   -Quickness};     // up
   if (MyEvent.keyCode == 39 && canMoveLeft == true) {maze.velocity_x=  Quickness};  // right
   if (MyEvent.keyCode == 40 && canMoveUp == true) {maze.velocity_y=  Quickness};   // down
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

       if (x > myCanvas.width * 0.66) maze.velocity_x= maze.velocity_x - Quickness;  
       if (x < myCanvas.width * 0.33) maze.velocity_x= maze.velocity_x + Quickness;  
       if (y > myCanvas.height * 0.66) maze.velocity_y= maze.velocity_y - Quickness; 
       if (y < myCanvas.height * 0.33) maze.velocity_y= maze.velocity_y + Quickness; 
       }

   MyEvent.preventDefault();   
   }

 addEventListener("keydown", MyKeyDownHandler);           // listen for keystrokes  
 addEventListener("keyup", MyKeyUpHandler);               // listen for keys released
 myCanvas.addEventListener("touchstart", MyTouchHandler);                
 myCanvas.addEventListener("touchmove", MyTouchHandler);  // listen for anything about touches
 myCanvas.addEventListener("touchend", MyTouchHandler);    
startLevel();

myCanvas.width = window.innerWidth - 20;            // fill the entire browser width
myCanvas.height = window.innerHeight - 70;          // fill the entire browser height


