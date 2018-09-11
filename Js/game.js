function startGame(level) {
    this.level = level;
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 10);
        myPlayer = new player(30, 30, "#A9A9A9","#000000", 235, 400);
        //myEnemy = new enemy(50, 50, "red", this.level);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function player(width, height, bodyColor, gunColor, x, y) { 
    this.width = width;
    this.height = height;
    this.gunWidth = 0.2 * this.width;
    this.gunHeight = 0.4 * this.height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.direction = "up";
    this.shoot = false;
    this.control = function() {
        if (myGameArea.keys && myGameArea.keys[37] && myPlayer.x > 0) {
            this.speedX = -1;
            this.direction = "left";
        }
        if (myGameArea.keys && myGameArea.keys[39] && myPlayer.x < 470) {
            this.speedX = 1; 
            this.direction = "right";
        }
        if (myGameArea.keys && myGameArea.keys[38] && myPlayer.y > 0) {
            this.speedY = -1; 
            this.direction = "up";
        }
        if (myGameArea.keys && myGameArea.keys[40] && myPlayer.y < 470) {
            this.speedY = 1; 
            this.direction = "down";
        }
        if (myGameArea.keys && myGameArea.keys[32]) {
            this.shoot = true;
        }
        this.x += this.speedX;
        this.y += this.speedY;  
        this.speedX = 0;
        this.speedY = 0; 
    }
    this.drawGun = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = gunColor;
        if (this.direction == "up") {
            ctx.fillRect(this.x + 0.4 * this.width, this.y - this.gunHeight, this.gunWidth, this.gunHeight);
        }
        if (this.direction == "down") {
            ctx.fillRect(this.x + 0.4 * this.width, this.y + this.height, this.gunWidth, this.gunHeight);
        }
        if (this.direction == "left") {
            ctx.fillRect(this.x - this.gunHeight, this.y + 0.4 * this.width, this.gunHeight, this.gunWidth);
        }   
        if (this.direction == "right") {
            ctx.fillRect(this.x + this.width, this.y + 0.4 * this.width, this.gunHeight, this.gunWidth);
        }           
    }
    this.drawBody = function() {     
        this.drawGun();
        ctx = myGameArea.context;
        ctx.fillStyle = bodyColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.update = function() {
        this.control();
        this.drawBody();
    }
}

/*
function enemy(width, height, color, level) {
    this.width = width;
    this.height = height;
    this.speedX = 0.8;
    this.speedY = 0.8;    
    this.x = Math.random() * 250;
    this.y = Math.random() * 200;    
    this.level = level;
    this.move = function() {
        this.x += this.speedX;
        if (this.x > 450 || this.x < 0) {
            this.speedX = -this.speedX;
        }
        this.y += this.speedY;      
        if (this.y > 450 || this.y < 0) {
            this.speedY = -this.speedY;
        }  
    }
    this.update = function() {
        this.move();
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
*/
function updateGameArea() {
    myGameArea.clear();  
    myPlayer.update();
    //myEnemy.update();  
}