var ctx = myCanvas.getContext("2d"); // Get the drawing context for the canvas
 var FPS = 40;                        // How many frames per second
 var Quickness = 3;                   // How quick he goes, when he's going
var canMoveUp = true
var canMoveDown = true
var canMoveRight = true
var canMoveLeft = true


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

        // only apply velocities if not moving the sprite further off-screen

        if ((this.velocity_x<0)) this.x += this.velocity_x;
        if ((this.velocity_x>0)) this.x += this.velocity_x;
        if ((this.velocity_y<0)) this.y+=  this.velocity_y;
        if ((this.velocity_y>0)) this.y+= this.velocity_y;

        if (this.visible) ctx.drawImage(this.MyImg, this.x, this.y, 6000, 3000);  // draw it
        }       



var hero= new MySprite("maze1.png"); // The maze("maze" + level + "1.png")

var character = new Image();
character.src = "character.png";

function Do_a_Frame () {
  var cw = 64;
  var ch = 64;
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);     // clear the background
    hero.Do_Frame_Things();                                   // hero
  var upData = ctx.getImageData(myCanvas.width / 2, (myCanvas.height / 2) - (ch / 2) - 3, 1, 1).data;
/*var downData = ctx.getImageData(myCanvas.width / 2, (myCanvas.height / 2) + (ch / 2) + 3, 1, 1).data;  //}to detect color around "c"
  var rightData = ctx.getImageData(myCanvas.height / 2, (myCanvas.width / 2) + (cw / 2) + 3, 1, 1).data;
  var leftData = ctx.getImageData(myCanvas.height / 2, (myCanvas.width / 2) - (cw / 2) - 3, 1, 1).data;*/
  var rgb = [ upData[0], upData[1], upData[2] ];
    if (rgb[1] == 255) canMoveUp = false;
      else canMoveUp = true;
     //console.log(rgb);  
  ctx.drawImage(character, (myCanvas.width / 2) - (cw / 2), (myCanvas.height / 2) - (ch / 2), cw, ch);
  // console.log("Character at ", (myCanvas.width / 2) - (cw / 2), (myCanvas.height / 2) - (ch / 2), cw, ch);
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
  console.log("can go up?", canMoveUp);
   if (MyEvent.keyCode == 37) {hero.velocity_x=   Quickness};  // left
   if (MyEvent.keyCode == 38 && canMoveUp == true) {hero.velocity_y=   Quickness};  // up
   if (MyEvent.keyCode == 39) {hero.velocity_x=  -Quickness};  // right
   if (MyEvent.keyCode == 40) {hero.velocity_y=  -Quickness};  // down
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
 setInterval(Do_a_Frame, 1000/FPS);                  // set my frame renderer

myCanvas.width = window.innerWidth - 20;            // fill the entire browser width
myCanvas.height = window.innerHeight - 40;          // fill the entire browser height
 
