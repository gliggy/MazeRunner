var ctx = myCanvas.getContext("2d"); // Get the drawing context for the canvas
 var FPS = 40;                        // How many frames per second
 var Quickness = 3;                   // How quick he goes, when he's going



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



var hero= new MySprite("maze1.png"); // The maze

var character = new Image();
character.src = "character.png";

function Do_a_Frame () {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);     // clear the background
    ctx.font="20px arial";
    ctx.fillText("Hero x=" + hero.x + " y=" + hero.y, 0, 20); // show hero coordinates
    hero.Do_Frame_Things();                                   // hero
    ctx.drawImage(character, myCanvas.width / 2, myCanvas.height / 2);
    }




function MyKeyUpHandler (MyEvent) { 
   if (MyEvent.keyCode == 37 || MyEvent.keyCode == 39) {hero.velocity_x= 0}; // not left or right
   if (MyEvent.keyCode == 38 || MyEvent.keyCode == 40) {hero.velocity_y= 0}; // not up or down
   }


function MyKeyDownHandler (MyEvent) { 
   if (MyEvent.keyCode == 37) {hero.velocity_x=   Quickness};  // left
   if (MyEvent.keyCode == 38) {hero.velocity_y=   Quickness};  // up
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
myCanvas.height = window.innerHeight - 20;          // fill the entire browser height
 
