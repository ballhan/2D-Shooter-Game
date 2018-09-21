var myBird;
var myObstacles = [];
var myScore;
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
const canvasHeight = canvas.height = 0.8 * window.innerHeight;
const canvasWidth = canvas.width = 0.5 * canvasHeight;
const birdWidth = 0.05 * window.innerHeight;
const birdHeight = birdWidth;
const birdColor = "#FF0000";

function startGame() {
    myBird = new bird();
    myBird.gravity = 0.05;
    myGameArea.start();
}

var myGameArea = {
    start : function() {
        updateGameArea();
    },
    clear : function() {
        c.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function bird() {
    this.bodyWidth = birdWidth;
    this.bodyHeight = birdHeight;
    this.bodyColor = birdColor;
    this.speedY = 0;    
    //spawn X,Y
    this.x = 0.2 * canvasWidth;
    this.y = 0.3 * canvasHeight;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.draw = function() {
        c.fillStyle = this.bodyColor;
        c.fillRect(this.x, this.y, this.bodyWidth, this.bodyHeight);
    }
    this.move = function() {
        var buttomMargin = canvasHeight - birdHeight;
        this.gravitySpeed += this.gravity;
        this.y += this.speedY + this.gravitySpeed;
        if (this.y >= buttomMargin) {
            this.y = buttomMargin;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(pillarArray) {
        var x1 = this.x;
        var x2 = this.x + this.bodyWidth;
        var y1 = this.y;
        var y2 = this.y + this.bodyHeight;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            return;
        }
    }
    this.update = function() {
        this.draw();
        this.move();
    }
}

function updateGameArea() {
    myGameArea.clear();  
    myBird.update();
    requestAnimationFrame(updateGameArea);
}

function accelerate(n, bird) {
    bird.gravity = n;
}