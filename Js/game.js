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
        myPlayer = new player();
        myEnemy = new enemy(myPlayer);
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

function player() { 
    this.bodyWidth = 30;
    this.bodyHeight = 30;
    this.gunWidth = 6;
    this.gunHeight = 12;
    this.bodyColor = "#A9A9A9";
    this.gunColor = "#000000";
    this.x = 235;
    this.y = 400;    
    this.speedX = 0;
    this.speedY = 0;    
    this.direction = "up";
    this.shoot = false;
    //keyboard control
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
    //draw gun according to movement
    this.drawGun = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = this.gunColor;
        if (this.direction == "up") {
            ctx.fillRect(this.x + 0.4 * this.bodyWidth, this.y - this.gunHeight, this.gunWidth, this.gunHeight);
        }
        if (this.direction == "down") {
            ctx.fillRect(this.x + 0.4 * this.bodyWidth, this.y + this.bodyHeight, this.gunWidth, this.gunHeight);
        }
        if (this.direction == "left") {
            ctx.fillRect(this.x - this.gunHeight, this.y + 0.4 * this.bodyWidth, this.gunHeight, this.gunWidth);
        }   
        if (this.direction == "right") {
            ctx.fillRect(this.x + this.bodyWidth, this.y + 0.4 * this.bodyWidth, this.gunHeight, this.gunWidth);
        }           
    }
    //draw player with gun
    this.drawPlayer = function() {     
        this.drawGun();
        ctx = myGameArea.context;
        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(this.x, this.y, this.bodyWidth, this.bodyHeight);
    }
    this.update = function() {
        this.control();
        this.drawPlayer();
    }
}

function enemy(player) {
    this.player = player;
    this.width = 40;
    this.height = 40;
    this.color = "#FF0000";
    this.speedX = 0.8;
    this.speedY = 0.8; 
    this.movement = Math.random();   
    console.log(this.movement);
    //random spawn location
    this.x = Math.random() * 250;
    this.y = Math.random() * 200;
    //4 types of move chosen by random    
    this.move = function() {
        //only move on x
        if (this.movement < 0.2) {
            this.x += this.speedX;
            if (this.x > 460 || this.x < 0) {
            this.speedX = -this.speedX;
            }
        }
        //only move on y
        if (this.movement >= 0.2 && this.movement < 0.4) {
            this.y += this.speedY;      
            if (this.y > 460 || this.y < 0) {
                this.speedY = -this.speedY;
            }  
        }
        //move on x and y
        if (this.movement >= 0.4 && this.movement < 0.6) {
            this.x += this.speedX;
            if (this.x > 460 || this.x < 0) {
            this.speedX = -this.speedX;
            }
            this.y += this.speedY;      
            if (this.y > 460 || this.y < 0) {
                this.speedY = -this.speedY;
            }  
        }
        //follow player
        if (this.movement >= 0.6) {
            this.speedX = 0.3;
            this.speedY = 0.3;
            offset = 5;
            if (this.x < this.player.x - offset && this.x < 460) {
                this.x += this.speedX;
            }
            if (this.x > this.player.x - offset && this.x > 0) {
                this.x -= this.speedX;                
            }
            if (this.y > this.player.y - offset && this.y > 0) {
                this.y -= this.speedY;                
            }
            if (this.y < this.player.y - offset && this.y < 460) {
                this.y += this.speedY;                
            }

        }

    }
    this.drawEnemy = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
    this.update = function() {
        this.move();
        this.drawEnemy();
    }
}

function updateGameArea() {
    myGameArea.clear();  
    myPlayer.update();
    myEnemy.update();  
}