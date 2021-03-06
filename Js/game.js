//global varible
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var canvasWidth;
var canvasHeight;
if (window.innerHeight > window.innerWidth) {
    canvasWidth = canvas.width = 0.7 * window.innerWidth;
    canvasHeight = canvas.height = canvasWidth;
}
else {
    canvasHeight = canvas.height = 0.7 * window.innerHeight;
    canvasWidth = canvas.width = canvasHeight;
}
var myPlayer;
var myBullet = [];
var myEnemy = [];
var level = 1;
var bulletCount = 0;
const playerBodyWidth = 0.06 * canvasWidth;
const playerBodyHeight = playerBodyWidth;
const playerBodyColor = "#A9A9A9";
const playerGunWidth = playerBodyWidth;
const playerGunHeight = 1/3 * playerBodyWidth;
const playerGunColor = "#000000";
const playerSpawnX = (canvasWidth - playerBodyWidth)/2;
const playerSpawnY = 0.9 * canvasHeight;
const bulletWidth = 1/3 * playerBodyWidth;
const bulletHeight = bulletWidth;
const bulletSpeed = 8/500 * canvasWidth;
const bulletColor = "#FFD700";

function startGame() {
    myGameArea.start();
}

var myGameArea = {
    start : function() {
        myPlayer = new player();
        for (i = 0; i < level; i ++) {
            myEnemy.push(new enemy(myPlayer));
        }
        updateGameArea();
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
    }, 
    clear : function() {
        c.clearRect(0, 0, canvas.width, canvas.height);
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
    this.shootRate = 250;
    //keyboard control
    this.move = function() {
        playerMargin = canvasHeight - playerBodyHeight;
        if (myGameArea.keys && myGameArea.keys[37] && myPlayer.x > 0) {
            this.speedX = -1.5 / 500 * canvasWidth;
            this.direction = "left";
        }
        if (myGameArea.keys && myGameArea.keys[39] && myPlayer.x < playerMargin) {
            this.speedX = 1.5 / 500 * canvasWidth; 
            this.direction = "right";
        }
        if (myGameArea.keys && myGameArea.keys[38] && myPlayer.y > 0) {
            this.speedY = -1.5 / 500 * canvasWidth; 
            this.direction = "up";
        }
        if (myGameArea.keys && myGameArea.keys[40] && myPlayer.y < playerMargin) {
            this.speedY = 1.5 / 500 * canvasWidth; 
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
        c.fillStyle = this.gunColor;
        if (this.direction == "up") {
            c.fillRect(this.x, this.y, this.gunWidth, this.gunHeight);
        }
        if (this.direction == "down") {
            c.fillRect(this.x, this.y + this.bodyHeight - this.gunHeight, this.gunWidth, this.gunHeight);
        }
        if (this.direction == "left") {
            c.fillRect(this.x, this.y, this.gunHeight, this.gunWidth);
        }   
        if (this.direction == "right") {
            c.fillRect(this.x + this.bodyWidth - this.gunHeight, this.y, this.gunHeight, this.gunWidth);
        }           
    }
    //draw player with gun
    this.drawPlayer = function() {    
        c.fillStyle = this.bodyColor;
        c.fillRect(this.x, this.y, this.bodyWidth, this.bodyHeight);
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

//create playerBullet, playerBullet can move, hit enemy and clear
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
    this.bulletX1 = 0;
    this.bulletX2 = 0;
    this.bulletY1 = 0;
    this.bulletY2 = 0;
    //draw bullet 
    this.drawBullet = function() {
        bulletOffset = (playerBodyWidth - bulletWidth) / 2;
        c.fillStyle = this.bulletColor;
        if (this.direction == "up") {
            c.fillRect(this.x + bulletOffset, this.y - bulletOffset, this.bulletWidth, this.bulletHeight);
        }
        if (this.direction == "down") {
            c.fillRect(this.x + bulletOffset, this.y + this.playerHeight, this.bulletWidth, this.bulletHeight);
        }
        if (this.direction == "left") {
            c.fillRect(this.x - this.bulletHeight, this.y + bulletOffset, this.bulletHeight, this.bulletWidth);
        }   
        if (this.direction == "right") {
            c.fillRect(this.x + this.playerWidth, this.y + bulletOffset, this.bulletHeight, this.bulletWidth);
        }      
    }  
    this.bulletMove = function() {
        bulletLowMargin = - bulletWidth / 2;
        bulletHighMargin = bulletWidth / 2 + canvasWidth;
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
    	bulletOffset = bulletWidth / 2;
    	highBoundryX = canvasWidth;
    	highBoundryY = canvasHeight;
    	lowBoundryX = 0;
    	lowBoundryY = 0;
        if (this.direction == "up") {
            this.bulletX1 = this.x + bulletOffset;
            this.bulletX2 = this.x + bulletOffset + this.bulletWidth;
            this.bulletY1 = this.y - bulletOffset;
            this.bulletY2 = this.y - bulletOffset + this.bulletHeight;
        }
        if (this.direction == "down") {
            this.bulletX1 = this.x + bulletOffset;
            this.bulletX2 = this.x + bulletOffset + this.bulletWidth;
            this.bulletY1 = this.y + this.playerHeight;
            this.bulletY2 = this.y + bulletOffset + this.bulletHeight;
        }
        if (this.direction == "left") {
            this.bulletX1 = this.x - this.bulletHeight;
            this.bulletX2 = this.x - this.bulletHeight + this.bulletWidth;
            this.bulletY1 = this.y + bulletOffset;
            this.bulletY2 = this.y + bulletOffset + this.bulletHeight;
        }     
        if (this.direction == "right") {
            this.bulletX1 = this.x + this.playerWidth;
            this.bulletX2 = this.x + this.playerWidth + this.bulletWidth;
            this.bulletY1 = this.y + bulletOffset;
            this.bulletY2 = this.y + bulletOffset + this.bulletHeight;
        }
        //remove out of bounce bullet from bullet array
        if (this.bulletX1 > highBoundryX || this.bulletY1 > highBoundryY || this.bulletX2 < lowBoundryX || this.bulletY2 < lowBoundryY) {
        	this.bulletArray.splice(bulletCount - 1, 1);
        	bulletCount --;
        	//console.log(myBullet.length);
        }  
        //check hit enemy
        for (var i = 0; i < this.enemyArray.length; i++) {
            enemyX1 = enemyArray[i].x;
            enemyX2 = enemyArray[i].x + enemyArray[i].bodyWidth;
            enemyY1 = enemyArray[i].y;
            enemyY2 = enemyArray[i].y + enemyArray[i].bodyHeight;
            enemyType = enemyArray[i].enemyType;
            if (enemyX1 < this.bulletX2 && enemyX2 > this.bulletX1 && enemyY1 < this.bulletY2 && enemyY2 > this.bulletY1) {
                //for boss enemy
                if (enemyType >= 0.8) {
                    //remove bullet from bullet array
                    this.bulletArray.splice(bulletCount - 1, 1);
                    bulletCount--;
                    //change shape
                    enemyArray[i].enemyLife --;
                    //check die
                    if (enemyArray[i].enemyLife <= 2) {
                        enemyArray.splice(i, 1);
                    }
                }
                else {
                    //remove bullet from bullet array
                    this.bulletArray.splice(bulletCount - 1, 1);
                    bulletCount--;
                    //remove enemy from enemy array
                    enemyArray.splice(i, 1);
                }
            }
        }
        //check if nextlevel
        if (this.enemyArray.length < 1) {    
            level ++;
            for (i = 0; i < level; i ++) {
                myEnemy.push(new enemy(myPlayer));
            }
        }
    }
    this.update = function() {
        this.drawBullet();
        this.bulletMove();
        this.checkHitAndClear();
    }
}

//create enemy object, enemy can move, win by hit player and restart the game
function enemy(player) {
    this.player = player;
    this.enemyType;
    this.bodyWidth;
    this.bodyHeight;
    this.bodyColor;
    this.speedX = 1 / 500 * canvasWidth;
    this.speedY = this.speedX;
    //random spawn location
    this.x = Math.random() * canvasWidth / 2;
    this.y = Math.random() * 0.2 * canvasHeight;
    //for boss
    this.enemyLife = 6;
    this.enemyType = Math.random();
    this.drawEnemy = function() {
        if (this.enemyType < 0.25) {
            this.bodyWidth = 4/50 * canvasWidth;
            this.bodyHeight = this.bodyWidth;
            this.bodyColor = "#FFB2B2";
        }
        if (this.enemyType >= 0.25 && this.enemyType < 0.5) {
            this.bodyWidth = 4/50 * canvasWidth;
            this.bodyHeight = this.bodyWidth;
            this.bodyColor = "#FF4C4C";
        }
        if (this.enemyType >= 0.5 && this.enemyType < 0.8) {
            this.bodyWidth = 3/50 * canvasWidth;
            this.bodyHeight = this.bodyWidth;
            this.bodyColor = "#FF0000";
        }
        if (this.enemyType >= 0.8) {
            this.bodyWidth = this.enemyLife * 1/50 * canvasWidth;
            this.bodyHeight = this.bodyWidth;
            this.bodyColor = "#7F0000";
        }
        c.fillStyle = this.bodyColor;
        c.fillRect(this.x, this.y, this.bodyWidth, this.bodyHeight);
    }
    this.move = function() {
        if (this.enemyType < 0.25) {
            enemyMargin = canvasWidth - this.bodyWidth;
            this.x += this.speedX;
            if (this.x > enemyMargin || this.x < 0) {
                this.speedX = -this.speedX;
            }
        }
        if (this.enemyType >= 0.25 && this.enemyType < 0.5) {
            enemyMargin = canvasHeight - this.bodyHeight;
            this.y += this.speedY;      
            if (this.y > enemyMargin || this.y < 0) {
                this.speedY = -this.speedY;
            }  
        }
        if (this.enemyType >= 0.5) {
            this.speedX = 1 / 1000 * canvasWidth;
            this.speedY = this.speedX;
            enemyMarginX = canvasWidth - this.bodyWidth;
            enemyMarginY = canvasHeight - this.bodyHeight;
            chaseOffsetX = Math.abs(this.bodyWidth - this.player.bodyWidth) / 2;
            chaseOffsetY = Math.abs(this.bodyHeight - this.player.bodyHeight) / 2;
            if (this.x < this.player.x - chaseOffsetX && this.x < enemyMarginX) {
                this.x += this.speedX;
            }
            if (this.x > this.player.x - chaseOffsetX && this.x > 0) {
                this.x -= this.speedX;                
            }
            if (this.y > this.player.y - chaseOffsetY && this.y > 0) {
                this.y -= this.speedY;                
            }
            if (this.y < this.player.y - chaseOffsetY && this.y < enemyMarginY) {
                this.y += this.speedY;                
            }
        }
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
            document.location.reload();
        }
    }
    this.update = function() {
        this.drawEnemy();
        this.move();
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

function drawLevel() {
    c.font = "16px Arial";
    c.fillStyle = "#000000";
    c.fillText("Level: " + level, 8, 20);
}

function updateGameArea() {
    myGameArea.clear();  
    drawLevel();
    myPlayer.update();
    myEnemyUpdate(myEnemy);
    myBulletUpdate(myBullet);
    requestAnimationFrame(updateGameArea);
}