//global varible
var myPlayer;
var myBullet = [];
var myEnemy = [];
var enemySpeedX = 0.8;
var enemySpeedY = 0.8; 
var level = 1;
var bulletCount = 0;
const canvasWidth = 500;
const canvasHeight = 500;
const playerBodyWidth = 30;
const playerBodyHeight = 30;
const playerBodyColor = "#A9A9A9";
const playerGunWidth = 30;
const playerGunHeight = 8;
const playerGunColor = "#000000";
const playerSpawnX = 235;
const playerSpawnY = 400;
const enemyBodyWidth = 40;
const enemyBodyHeight = 40;
const enemyBodyColor = "#FF0000";
const bulletWidth = 10;
const bulletHeight = 10;
const bulletSpeed = 5;
const bulletColor = "#FFD700";

function startGame() {
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
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

//player object, player can move and control shoot
function player() { 
    this.bodyWidth = playerBodyWidth;
    this.bodyHeight = playerBodyHeight;
    this.gunWidth = playerGunWidth;
    this.gunHeight = playerGunHeight;
    this.bodyColor = playerBodyColor;
    this.gunColor = playerGunColor;
    this.x = playerSpawnX;
    this.y = playerSpawnY;    
    this.speedX = 0;
    this.speedY = 0;    
    this.direction = "up";
    this.shoot = false;
    //limited bullet shoot rate
    this.lastShootTime = 0;
    this.shootRate = 300;
    //keyboard control
    this.move = function() {
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
    this.shootBullet = function(){
    	var now = Date.now();
        if (this.shoot == true) {
        	this.shoot = false;
        	//limited bullet shoot rate;
        	if (now - this.lastShootTime  < this.shootRate) {
        		return;
        	} 
        	this.lastShootTime = now;
        	//add bullet object to bullet array
        	myBullet.push(new playerBullet(myPlayer, myEnemy, myBullet, this.bulletCount));
        	//increase bulletCount to track array index
        	bulletCount ++;
        	//console.log(this.bulletCount, myBullet.length);
        }
    }
    this.update = function() {
        this.move();
        this.drawPlayer();
        this.shootBullet();
    }
}

//create playerBullet, playerBullet can move, hit and clear
function playerBullet(player, enemyArray, bulletArray, bulletCount) { 
    this.bulletWidth = bulletWidth;
    this.bulletHeight = bulletHeight;
    this.bulletSpeed = bulletSpeed;
    this.bulletColor = bulletColor;
    //for draw purpose
    this.player = player;
    this.x = player.x;
    this.y = player.y;    
    this.direction = player.direction;
    this.playerWidth = player.bodyWidth;
    this.playerHeight = player.bodyHeight;
    //for checking hit and clear purpose
    this.enemyArray = enemyArray;
    this.bulletArray = bulletArray;
    this.bulletCount = bulletCount;
    //draw bullet 
    this.drawBullet = function() {
        bulletOffset = 10;
        ctx = myGameArea.context;
        ctx.fillStyle = this.bulletColor;
        if (this.direction == "up") {
            ctx.fillRect(this.x + bulletOffset, this.y - bulletOffset, this.bulletWidth, this.bulletHeight);
        }
        if (this.direction == "down") {
            ctx.fillRect(this.x + bulletOffset, this.y + this.playerHeight, this.bulletWidth, this.bulletHeight);
        }
        if (this.direction == "left") {
            ctx.fillRect(this.x - this.bulletHeight, this.y + bulletOffset, this.bulletHeight, this.bulletWidth);
        }   
        if (this.direction == "right") {
            ctx.fillRect(this.x + this.playerWidth, this.y + bulletOffset, this.bulletHeight, this.bulletWidth);
        }      
    }  
    this.bulletMove = function() {
        bulletLowMargin = -5;
        bulletHighMargin = 505;
        if (this.direction == "up" && this.y > bulletLowMargin) {
            this.y -= this.bulletSpeed;   
        }
        if (this.direction == "down" && this.y < bulletHighMargin) {
            this.y += this.bulletSpeed;
        }
        if (this.direction == "left" && this.x > bulletLowMargin) {
            this.x -= this.bulletSpeed;
        }   
        if (this.direction == "right" && this.x < bulletHighMargin) {
            this.x += this.bulletSpeed;
        }
    }
    this.checkHitAndClear = function() {
    	//for getting bullet coord
    	bulletOffset = 10;
    	highBoundryX = 500;
    	highBoundryY = 500;
    	lowBoundryX = 0;
    	lowBoundryY = 0;
        if (this.direction == "up") {
            bulletX1 = this.x + bulletOffset;
            bulletX2 = this.x + bulletOffset + this.bulletWidth;
            bulletY1 = this.y - bulletOffset;
            bulletY2 = this.y - bulletOffset + this.bulletHeight;
        }
        if (this.direction == "down") {
            bulletX1 = this.x + bulletOffset;
            bulletX2 = this.x + bulletOffset + this.bulletWidth;
            bulletY1 = this.y + this.playerHeight;
            bulletY2 = this.y + bulletOffset + this.bulletHeight;
        }
        if (this.direction == "left") {
            bulletX1 = this.x - this.bulletHeight;
            bulletX2 = this.x - this.bulletHeight + this.bulletWidth;
            bulletY1 = this.y + bulletOffset;
            bulletY2 = this.y + bulletOffset + this.bulletHeight;
        }     
        if (this.direction == "right") {
            bulletX1 = this.x + this.playerWidth;
            bulletX2 = this.x + this.playerWidth + this.bulletWidth;
            bulletY1 = this.y + bulletOffset;
            bulletY2 = this.y + bulletOffset + this.bulletHeight;
        }
        //remove out of bounce bullet from bullet array
        if (bulletX1 > highBoundryX || bulletY1 > highBoundryY || bulletX2 < lowBoundryX || bulletY2 < lowBoundryY) {
        	this.bulletArray.splice(bulletCount - 1, 1);
        	bulletCount --;
        	//console.log(myBullet.length);
        }  
        //check hit
        for (var i = 0; i < this.enemyArray.length; i++) {
            enemyX1 = enemyArray[i].x;
            enemyX2 = enemyArray[i].x + enemyArray[i].bodyWidth;
            enemyY1 = enemyArray[i].y;
            enemyY2 = enemyArray[i].y + enemyArray[i].bodyHeight;
            if (enemyX1 < bulletX2 && enemyX2 > bulletX1 && enemyY1 < bulletY2 && enemyY2 > bulletY1) {
                enemyArray[i].bodyColor = "#000000";
                //remove bullet from bullet array
                this.bulletArray.splice(bulletCount - 1, 1);
                bulletCount--;
                //remove enemy from enemy array
                enemyArray.splice(i, 1);
            }
        }
    }
    this.update = function() {
        this.drawBullet();
        this.bulletMove();
        this.checkHitAndClear();
    }
}

//create enemy object, enemy can move, hit
function enemy(player) {
    this.player = player;
    this.bodyWidth = enemyBodyWidth;
    this.bodyHeight = enemyBodyHeight;
    this.bodyColor = enemyBodyColor;
    this.speedX = enemySpeedX;
    this.speedY = enemySpeedY; 
    this.movement = Math.random();   
    //random spawn location
    this.x = Math.random() * 250;
    this.y = Math.random() * 200;
    //4 types of move chosen by random    
    this.move = function() {
        enemyMargin = 460;
        //only move on x
        if (this.movement < 0.15) {
            this.x += this.speedX;
            if (this.x > enemyMargin || this.x < 0) {
            this.speedX = -this.speedX;
            }
        }
        //only move on y
        if (this.movement >= 0.15 && this.movement < 0.3) {
            this.y += this.speedY;      
            if (this.y > enemyMargin || this.y < 0) {
                this.speedY = -this.speedY;
            }  
        }
        //move on x and y
        if (this.movement >= 0.3 && this.movement < 0.45) {
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
        if (this.movement >= 0.45) {
            //lower speed
            this.speedX = 0.5;
            this.speedY = 0.5;
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
        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(this.x, this.y, this.bodyWidth, this.bodyHeight);
    }
    this.checkWin = function() {
        //silentmatt.com/intersection.html 
        enemyX1 = this.x;
        enemyX2 = this.x + this.bodyWidth;
        enemyY1 = this.y;
        enemyY2 = this.y + this.bodyHeight;
        playerX1 = this.player.x;
        playerX2 = this.player.x + this.player.bodyWidth;
        playerY1 = this.player.y;
        playerY2 = this.player.y + this.player.bodyHeight;
        if (enemyX1 < playerX2 && enemyX2 > playerX1 && enemyY1 < playerY2 && enemyY2 > playerY1) {
            this.player.bodyColor = "#FF0000";
            document.location.reload();
            alert("GAME OVER");
        }
    }
    this.update = function() {
        this.move();
        this.drawEnemy();
        this.checkWin();
    }
}

function myEnemyUpdate(enemyArray) {
    for (i = 0; i < enemyArray.length; i++) {
        enemyArray[i].update();
    }
}

function myBulletUpdate(bulletArray) {
    for (i = 0; i < bulletArray.length; i++) {
        bulletArray[i].update();
    }
}

function nextLevel(enemyArray) {
	if (enemyArray.length < 1) {	
        level ++;
        enemySpeedX += 0.1;
        enemySpeedY += 0.1;
        myGameArea.clear();  
        myPlayer = new player();
        for (i = 0; i < level; i ++) {
            myEnemy.push(new enemy(myPlayer));
        }
	}
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Level: " + level, 8, 20);
}

function updateGameArea() {
    myGameArea.clear();  
    myPlayer.update();
    drawScore();
    myEnemyUpdate(myEnemy);
    myBulletUpdate(myBullet);
    nextLevel(myEnemy);
}