var ctx = myCanvas.getContext("2d"); // Get the drawing context for the canvas
 var FPS = 40;                        // How many frames per second
 var Quickness = 6;                   // How quick he goes, when he's going
var canMoveUp = true
var canMoveDown = true
var canMoveRight = true
var canMoveLeft = true
var nextLevel = false
var levelNumber = 1


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

        if ((this.velocity_x<0 && canMoveRight == true)) this.x += this.velocity_x; //left velocity
        if ((this.velocity_x>0 && canMoveLeft == true)) this.x += this.velocity_x;  //right velocity
        if ((this.velocity_y<0 && canMoveDown == true)) this.y+=  this.velocity_y;  //up velocity
        if ((this.velocity_y>0 && canMoveUp == true)) this.y+= this.velocity_y;     //down velocity
  
        if (this.visible) ctx.drawImage(this.MyImg, this.x, this.y, 6000, 3000);  // draw the maze
        }       



var hero;

var character = new Image();
character.src = "character.png";

var drawTimer = null;

function startLevel() {
  if (drawTimer) {
    clearInterval();
  }

  hero = new MySprite("maze" + levelNumber + ".png"); // The mazes
  drawTimer = setInterval(Do_a_Frame, 1000/FPS);                  // set my frame renderer
}

function Do_a_Frame () {
  var cw = 64;
  var ch = 64;
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);     // clear the background
    hero.Do_Frame_Things();                                   // maze
  var Data = ctx.getImageData(myCanvas.width / 2, myCanvas.height / 2, 1, 1).data;  
  var upData = ctx.getImageData(myCanvas.width / 2, (myCanvas.height / 2) - (ch / 2) - 3, 1, 1).data;
  var downData = ctx.getImageData(myCanvas.width / 2, (myCanvas.height / 2) + (ch / 2) + 3, 1, 1).data;
  var rightData = ctx.getImageData(myCanvas.width / 2 + (cw / 2) + 3, (myCanvas.height / 2), 1, 1).data;
  var leftData = ctx.getImageData(myCanvas.width / 2 - (cw / 2) - 3, (myCanvas.height / 2), 1, 1).data;
  canMoveUp = (upData[1] != 255);
  canMoveDown = (downData[1] != 255);
  canMoveRight = (rightData[1] != 255);
  canMoveLeft = (leftData[1] != 255);
  nextLevel = (Data[1] == 250);
   if (nextLevel){
     levelNumber = levelNumber + 1; 
     //setTimeout(Do_a_Frame, 2000);
     startLevel();
     }
  //console.log(levelNumber);
  ctx.drawImage(character, (myCanvas.width / 2) - (cw / 2), (myCanvas.height / 2) - (ch / 2), cw, ch);
    // draws character in the center of the screen
    ctx.fillStyle= "orange";
    ctx.font="20px arial";
    ctx.fillText("Hero x=" + hero.x + " y=" + hero.y, 0, 20); // show hero coordinates
    }




function MyKeyUpHandler (MyEvent) { 
   if (MyEvent.keyCode == 37 || MyEvent.keyCode == 39) {hero.velocity_x= 0}; // not left or right
   if (MyEvent.keyCode == 38 || MyEvent.keyCode == 40) {hero.velocity_y= 0}; // not up or down
   }


function MyKeyDownHandler (MyEvent) {
  //console.log("can go", canMoveUp, canMoveDown);
   if (MyEvent.keyCode == 37 && canMoveLeft == true) {hero.velocity_x=   Quickness};   // left
   if (MyEvent.keyCode == 38 && canMoveUp == true) {hero.velocity_y=   Quickness};     // up
   if (MyEvent.keyCode == 39 && canMoveRight == true) {hero.velocity_x=  -Quickness};  // right
   if (MyEvent.keyCode == 40 && canMoveDown == true) {hero.velocity_y=  -Quickness};   // down
   MyEvent.preventDefault();
   }


function MyTouchHandler (MyEvent) { 
   var rect = myCanvas.getBoundingClientRect();           // where is our canvas
   hero.velocity_y= 0; 
   hero.velocity_x= 0;                                    // zero out velocity

   for (var i=0; i < MyEvent.touches.length; i++) {
       var x = MyEvent.touches[i].clientX - rect.left;    // get x & y coords
       var y = MyEvent.touches[i].clientY - rect.top;     // relative to canvas

       // Add velocity depending on which thirds we see touch

       if (x > myCanvas.width * 0.66) hero.velocity_x= hero.velocity_x + Quickness;  
       if (x < myCanvas.width * 0.33) hero.velocity_x= hero.velocity_x - Quickness;  
       if (y > myCanvas.height * 0.66) hero.velocity_y= hero.velocity_y + Quickness; 
       if (y < myCanvas.height * 0.33) hero.velocity_y= hero.velocity_y - Quickness; 
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
myCanvas.height = window.innerHeight - 40;          // fill the entire browser height
 
