var myGamePiece;
var myObstacles = [];
var myScore;
var myHighScore;
var hs = 0;

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        moveup();
    }
    else if (e.keyCode == '40') {
        movedown();
    }
    else if (e.keyCode == '37') {
       moveleft();
    }
    else if (e.keyCode == '39') {
       moveright();
    }

}

function startGame() {
    var w = getComputedStyle(document.documentElement).getPropertyValue('--dim');
    myGamePiece = new component(80, 45, "car.png", 40, 250, "image");
    myScore = new component("30px", "Arcade", "red", 280, 40, "text");
    myHighScore = new component("30px", "Arcade", "blue", 280, 490, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        
        } 
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(20, height, "wall.jpg", x, 0, "image"));
        myObstacles.push(new component(20, x - height - gap, "wall.jpg", x, height + gap, "image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
    myScore.text="Current Score: " + myGameArea.frameNo;
    myScore.update();
    if (myGameArea.frameNo>hs){
        hs = myGameArea.frameNo;
        myHighScore.text = "High Score: "+ hs;
    }
    myHighScore.update();
    myGamePiece.newPos();    
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup() {
    var sp = myGameArea.frameNo/1000;
    myGamePiece.speedY = -1*sp; 
}

function movedown() {
    var sp = myGameArea.frameNo/1000;
    myGamePiece.speedY = 1*sp; 
}

function moveleft() {
    var sp = myGameArea.frameNo/1000;
    myGamePiece.speedX = -1*sp; 
}

function moveright() {
    var sp = myGameArea.frameNo/1000;
    myGamePiece.speedX = 1*sp; 
}

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}