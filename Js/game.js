var myPlayer;
var myEnemy = [];

function startGame() {
    level = 1;
    myGameArea.start(level);
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(level) {
        this.level = level;
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 10);
        myPlayer = new player();
        for (i = 0; i < level; i ++) {
            myEnemy.push(new enemy(myPlayer));
        }
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
    this.gunWidth = 30;
    this.gunHeight = 8;
    this.bulletWidth = 10;
    this.bulletHeight = 10;
    this.bodyColor = "#A9A9A9";
    this.gunColor = "#000000";
    this.bulletColor = "#FFD700";
    this.x = 235;
    this.y = 400;    
    this.speedX = 0;
    this.speedY = 0;    
    this.bulletSpeed = 5;
    this.direction = "up";
    this.shoot = false;
    //keyboard control
    this.control = function() {
        playerMargin = 470;
        if (myGameArea.keys && myGameArea.keys[37] && myPlayer.x > 0) {
            this.speedX = -1;
            this.direction = "left";
        }
        if (myGameArea.keys && myGameArea.keys[39] && myPlayer.x < playerMargin) {
            this.speedX = 1; 
            this.direction = "right";
        }
        if (myGameArea.keys && myGameArea.keys[38] && myPlayer.y > 0) {
            this.speedY = -1; 
            this.direction = "up";
        }
        if (myGameArea.keys && myGameArea.keys[40] && myPlayer.y < playerMargin) {
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
    //draw bullet 
    this.drawBullet = function() {
        bulletOffset = 10;
        ctx = myGameArea.context;
        ctx.fillStyle = this.bulletColor;
        if (this.direction == "up") {
            ctx.fillRect(this.x + bulletOffset, this.y - bulletOffset, this.bulletWidth, this.bulletHeight);
        }
        if (this.direction == "down") {
            ctx.fillRect(this.x + bulletOffset, this.y + this.bodyHeight, this.bulletWidth, this.bulletHeight);
        }
        if (this.direction == "left") {
            ctx.fillRect(this.x - this.bulletHeight, this.y + bulletOffset, this.bulletHeight, this.bulletWidth);
        }   
        if (this.direction == "right") {
            ctx.fillRect(this.x + this.bodyWidth, this.y + bulletOffset, this.bulletHeight, this.bulletWidth);
        }
        this.shoot = false;           
    }  
    this.shootBullet = function(){
        if (this.shoot == true) {
            this.drawBullet();
        }
    }
    //draw gun according to movement
    this.drawGun = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = this.gunColor;
        if (this.direction == "up") {
            ctx.fillRect(this.x, this.y, this.gunWidth, this.gunHeight);
        }
        if (this.direction == "down") {
            ctx.fillRect(this.x, this.y + this.bodyHeight - this.gunHeight, this.gunWidth, this.gunHeight);
        }
        if (this.direction == "left") {
            ctx.fillRect(this.x, this.y, this.gunHeight, this.gunWidth);
        }   
        if (this.direction == "right") {
            ctx.fillRect(this.x + this.bodyWidth - this.gunHeight, this.y, this.gunHeight, this.gunWidth);
        }           
    }
    //draw player with gun
    this.drawPlayer = function() {     
        ctx = myGameArea.context;
        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(this.x, this.y, this.bodyWidth, this.bodyHeight);
        this.drawGun();
    }
    this.update = function() {
        this.control();
        this.shootBullet();
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
    //random spawn location
    this.x = Math.random() * 250;
    this.y = Math.random() * 200;
    //4 types of move chosen by random    
    this.move = function() {
        enemyMargin = 460;
        //only move on x
        if (this.movement < 0.2) {
            this.x += this.speedX;
            if (this.x > enemyMargin || this.x < 0) {
            this.speedX = -this.speedX;
            }
        }
        //only move on y
        if (this.movement >= 0.2 && this.movement < 0.4) {
            this.y += this.speedY;      
            if (this.y > enemyMargin || this.y < 0) {
                this.speedY = -this.speedY;
            }  
        }
        //move on x and y
        if (this.movement >= 0.4 && this.movement < 0.6) {
            this.x += this.speedX;
            if (this.x > enemyMargin || this.x < 0) {
            this.speedX = -this.speedX;
            }
            this.y += this.speedY;      
            if (this.y > enemyMargin || this.y < 0) {
                this.speedY = -this.speedY;
            }  
        }
        //follow player
        if (this.movement >= 0.6) {
            //lower speed
            this.speedX = 0.3;
            this.speedY = 0.3;
            chaseOffset = 5;
            if (this.x < this.player.x - chaseOffset && this.x < enemyMargin) {
                this.x += this.speedX;
            }
            if (this.x > this.player.x - chaseOffset && this.x > 0) {
                this.x -= this.speedX;                
            }
            if (this.y > this.player.y - chaseOffset && this.y > 0) {
                this.y -= this.speedY;                
            }
            if (this.y < this.player.y - chaseOffset && this.y < enemyMargin) {
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

function enemyUpdate(enemyArray) {
    for (i = 0; i < enemyArray.length; i++) {
        enemyArray[i].update();
    }
}

function updateGameArea() {
    myGameArea.clear();  
    myPlayer.update();
    enemyUpdate(myEnemy);  
}