/*
	Space Destiny
	Destroy enemies and get points
	
	Blown up enemies give items:
	powerup Bolt - 
	PowerUp Shield - Max Shield Increased by 20
	PowerUp Star - 
	Star - 10 score
	
	Buy Upgrades
	Engines
	Guns
	
	
TODO SPEED IMPROVEMENT
* 	//TODO force landscape mode since it's WAY faster
	//disable trails.. minimize explosions & render them another way	


 */
 
 
SpaceDestiny.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

	this.cursors;
	this.bank;
	this.player;
	this.shipTrail;
	this.explosions;
	this.bullets;
	this.fireButton;
	this.bulletTimer=0;
	this.shields;
	
	this.enemies = {};
	this.enemySettings  = {
		'red' : { damage:20, total:5 },
		'black' : { damage:40, total:30 },
		'blue' : { damage:40, total:30 },
	};
	this.blueEnemyLaunched = false;
	this.redEnemySpacing= 1000;
	
	this.enemyBullets;
	/*
	 * Left for debugging purposes
	this.redEnemies;
	this.redEnemyLaunchTimer;
	this.blueEnemies;
	this.blueEnemyLaunchTimer;
	* */
	
	this.score=0;
	this.scoreText;
	this.gameOver;
	this.playerDeath;
	
	this.ACCELERATION = 600;
	this.DRAG = 400;
	this.MAXSPEED = 400;
	

};
/*
 
 */

SpaceDestiny.Game.prototype = {

	create: function () {
		this.game.clearBeforeRender = false;
		//this.goFull();

		var enabled = this.game.renderer.setTexturePriority(['starfield', 'ship', 'bullet','explosion', 'enemy-blue', 'enemy-red']);
		if (enabled !== undefined) {
			if (enabled.length < this.game.renderer.maxTextures)
			//  Enable for the BitmapFont
				this.game.cache.getBitmapFont('spacefont').base.textureIndex = enabled.length + 1;
		}

		CyberPro.init('SpaceDestiny');
			//Used for FPS showing
	//	this.game.time.advancedTiming = true;
		this.timeout= this.game.time.time+2000; 
		
		//Desired fps to 30 so it speeds everything up  and doesn't try to go to 60 or beyond.. good for mobile platforms
		//maybe on some platforms detect the FPS internally view if it's a mobile platform and set it lower.. between 20 and 30 (24 or 25)
		this.game.time.desiredFps = 30;
		
		this.game.renderer.renderSession.roundPixels = true;
       this.game.forceSingleUpdate = true;
		
		this.explodeSound = this.add.audio('blast'); 
		this.laserSound = this.add.audio('laser_sound'); 
		this.music = this.add.audio('music'); 
		//  The scrolling starfield background
		this.starfield = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'starfield');
//		console.log(" world" + this.world.width + " " + this.world.height);
	this.generateHero();

	if (0) {
		   this.shields = this.add.text(this.game.world.width - 250, 10, 'Shields: ' + this.player.health +'%',
		   {font: "3em kenvector_future_thin", stroke: '#0B79AE', strokeThickness:5, fill: "#FFFFFF", align: "center" });
		   	this.text = this.add.text(this.game.world.centerX, 20, "Space Destiny", { font: "32px kenvector_future_thin", stroke: '#0B79AE', strokeThickness:5, fill: "#FFFFFF", align: "center" });
			this.gameOver = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'GAME OVER!', { font: '84px kenvector_future_thin', fill: '#fff' });
			this.gameOver.anchor.setTo(0.5, 0.5);
			this.scoreText = this.game.add.text(10, 10, '', { font: '20px kenvector_future_thin', fill: '#fff' });
		}
		 //  Shields stat
	     this.shields = this.game.add.bitmapText(this.game.world.width, 10,   'spacefont', '' + this.player.health +'%', 35);
	    this.shields.x = this.shields.x - this.shields.textWidth*3.5;
	    //Note the rendering of the shield text so we don't have to call another function 
	    this.shields.render = function () {
	        this.shields.text = 'Shields: ' + Math.max(this.player.health, 0) +'%';
	    };
	     this.shields.render.call(this);
	     
		this.text = this.add.bitmapText(this.game.world.centerX, 40,  'spacefont' , "Space Destiny" ,45 );
		this.text.x = this.text.x - this.text.textWidth/2;
		//True centering..
		this.gameOver = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'spacefont', 'GAME OVER!', 110);
		this.gameOver.x = this.gameOver.x - this.gameOver.textWidth / 2;
		this.gameOver.y = this.gameOver.y - this.gameOver.textHeight / 3;
	
		this.gameOver.visible = false;
		
		   //  Score

		this.scoreText = this.game.add.bitmapText(10, 10, 'spacefont', '', 35);
		this.scoreText.render = function () {
			this.scoreText.text = 'Score: ' + CyberPro.highscore.currentScore +
			 "\nBest:" + CyberPro.highscore.bestScore ;
		};
		//Again use call to give the "global" callback context
	   this.scoreText.render.call(this);

	
	
		
		//this.createRedEnemies();
		//Create enemies 
		this.createEnemies('blue');
		this.createEnemies('red');
		this.game.time.events.add(1000,this.launchEnemy,this,'red');
		
		this.generateBullets();
		//   some controls to play the game with (cursor games)
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		//TODO specific subfunction!
		
		this.explosionPool();

		//Todo play music only if.. requested or if not paused in settings
		this.music.play();
		CyberPro.highscore.currentScore = this.score = 0;
			

		//Todo different function for texts
		//TEXT RENDERING IS EXPENSIVE.. MOVE TO DOM.. invisible overlay?
		//or use bitmap fonts
		
	
	    
	},
	generateHero: function() {
			//  The hero!
		this.player = this.add.sprite(this.world.centerX, this.world.height - this.cache.getImage('ship').height*3/2, 'ship');
		this.player.health = 100;
		this.player.anchor.setTo(0.5, 0.5);
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		
		//this.player.body.collideWorldBounds = true;
		//Realistic and improved  movement acceleration and velocity
		this.player.body.maxVelocity.setTo(this.MAXSPEED, this.MAXSPEED);
		this.player.body.drag.setTo(this.DRAG, this.DRAG);
		this.player.weaponLevel = 1;
		//this kills our player automatically when the health is 0 or below
		this.player.events.onKilled.add(function(){
			this.shipTrail.kill();
		},this);
		
		this.player.events.onRevived.add(function() {
			this.shipTrail.start(false,5000,10);
		},this);
		//  Add an emitter for the ship's trail
		this.shipTrail = this.game.add.emitter(this.player.x, this.player.y + 10, 400);
		this.shipTrail.width = 20;
		this.shipTrail.makeParticles('fire');
		this.shipTrail.setXSpeed(30, -30);
		this.shipTrail.setYSpeed(200, 180);
		this.shipTrail.setRotation(50,-50);
		this.shipTrail.setAlpha(1, 0.01, 800);
		//The bigger the scale size the slower it will actually be
		this.shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
	//	this.shipTrail.setScale(1, 1, 1, 1, 2000, Phaser.Easing.Quintic.Out);
		this.shipTrail.start(false, 5000, 10);
		
		
	   //  Big explosion
    this.playerDeath = this.game.add.emitter(this.player.x, this.player.y);
    this.playerDeath.width = 50;
    this.playerDeath.height = 50;
    this.playerDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 10);
    this.playerDeath.setAlpha(0.9, 0, 800);
    this.playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

	},
	generateBullets: function() {
				//  Our bullet group
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(30, 'bullet');
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 1);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);


	    //  Blue enemy's bullets
	    this.enemyBullets = this.game.add.group();
	     this.enemyBullets.enableBody = true;
	      this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
	      this.enemyBullets.createMultiple(30, 'enemyBullet');
	     // this.enemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
	      this.enemyBullets.setAll('alpha', 0.9);
	      this.enemyBullets.setAll('anchor.x', 0.5);
	      this.enemyBullets.setAll('anchor.y', 0.5);
	      this.enemyBullets.setAll('outOfBoundsKill', true);
	      this.enemyBullets.setAll('checkWorldBounds', true);
	      this.enemyBullets.forEach(function(enemy){
	        enemy.body.setSize(20, 20);
	    },this);
		
	},
	//A general "enemy" creation functionbased on the enemyType
	createEnemies: function(enemyType) {
	 
		//  The baddies!
		this.enemies[enemyType] = this.game.add.group();
		this.enemies[enemyType] .enableBody = true;
		this.enemies[enemyType] .physicsBodyType = Phaser.Physics.ARCADE;
		this.enemies[enemyType] .createMultiple(this.enemySettings[enemyType].total, 'enemy-'+ enemyType);
		this.enemies[enemyType] .setAll('anchor.x', 0.5);
		this.enemies[enemyType] .setAll('anchor.y', 0.5);
	//	this.redEnemies.setAll('scale.x', 0.5);
	//	this.redEnemies.setAll('scale.y', 0.5);
	//	this.enemies[enemyType].setAll('angle', 180);
	//	this.enemies[enemyType] .setAll('outOfBoundsKill', true);
	//	this.enemies[enemyType] .setAll('checkWorldBounds', true);
		
		//Loop through all enemies.. add a emitter trail and a function on killed.. to kill the trail
	    this.enemies[enemyType] .forEach(function(enemy){
	        this.addEnemyEmitterTrail(enemy);
	        //The original enemy body is too large.. we need to make it smaller about 3/4
			enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4,enemy.width * 1 / 6, enemy.height * 1 / 6);
			enemy.anchor.set(0.5);
			enemy.damageAmount = this.enemySettings[enemyType].damage;
	        enemy.events.onKilled.add(function(){
	            enemy.trail.kill();
	        });
	    },this);
							
	},
	
	 launchEnemy: function(enemyType) {
	//	var MIN_ENEMY_SPACING = 300;
//		var MAX_ENEMY_SPACING = 3000;
		var ENEMY_SPEED = 300;
		if (enemyType == 'blue') {
			//this.launchBlueEnemy.call(this,enemyType);
			this.launchBlueEnemy.call(this,enemyType);
			return 0;
		}

		var enemy =  this.enemies[enemyType].getFirstExists(false);
		if (enemy) {
			enemy.reset(this.game.rnd.integerInRange(0, this.game.width), -20);
			//direction on x axis.. always random
			enemy.body.velocity.x = this.game.rnd.integerInRange(-300, 300);
			enemy.body.velocity.y = ENEMY_SPEED;
			enemy.body.drag.x = 100;
			
			//START TRAIL
			enemy.trail.start(false, 800, 1);
			//  Update function for each enemy ship to update rotation etc
	       enemy.update = function(){
	          enemy.angle = 180 - this.game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
	          
	          //TRAIL FOLLOWS THE ENEMY
				enemy.trail.x = enemy.x;
				enemy.trail.y = enemy.y -10;
	
	          //  Kill enemies once they go off screen (ONLY Y MATTERS SINCE THEY GO DOWN ANYWAY)
				if (enemy.y > this.game.height + 200) {
					enemy.kill();
				}
			}
		}

		//  Send another enemy soon
		this.enemies[enemyType].redEnemyLaunchTimer = this.time.events.add(this.game.rnd.integerInRange(this.redEnemySpacing, this.redEnemySpacing+1000), this.launchEnemy,this,enemyType);
	},
	getEnemyBullet: function() {
		return  this.enemyBullets.getFirstExists(false);
	},
	
	 launchBlueEnemy: function(enemyType) {
		var startingX = this.game.rnd.integerInRange(100, this.game.width - 100);
		var verticalSpeed = 180;
		var spread = 160;
		var frequency = 70;
		var verticalSpacing = 70;
		var numEnemiesInWave = 5;
		var timeBetweenWaves = 2500;

		//  Launch wave
		for (var i =0; i < numEnemiesInWave; i++) {
			var enemy = this.enemies[enemyType].getFirstExists(false);
			if (enemy) {
				enemy.startingX = startingX;
				enemy.reset(this.game.width / 2, -verticalSpacing * i);
				enemy.body.velocity.y = verticalSpeed;
				
				   //  Set up firing
       
            enemy.fireSettings = { bulletSpeed: 400, firingDelay: 1000};
            enemy.bullets = 2;
            enemy.lastShot = 0;
       
			//  Update function for each enemy
			enemy.update = function(){
			  //  Wave movement
				this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;

				//  Squish and rotate ship for illusion of "banking"
				bank = Math.cos((this.y + 60) / frequency)
				this.scale.x = 1 - Math.abs(bank) / 8;
				this.angle = 180 - bank * 2;



				  //  Kill enemies once they go off screen
				  if (this.y > this.game.height + 200) {
					this.kill();
				  }
				};
				
			this.game.time.events.add(enemy.fireSettings.firingDelay  + this.rnd.integerInRange(300,1500), this.shootAtPlayer,this,enemy);
	
			}
		}

		//  Send another wave soon
		this.enemies[enemyType].blueEnemyLaunchTimer = this.game.time.events.add(this.game.rnd.integerInRange(timeBetweenWaves,timeBetweenWaves+4000), this.launchBlueEnemy,this,enemyType);
	},
	
	shootAtPlayer: function(enemy) {
		var bulletSpeed = 400;
        var firingDelay = 2000;
		enemyBullet = this.enemyBullets.getFirstExists(false);
			//&& 						  enemy.y > this.game.width / 8
		if (enemyBullet &&
			  enemy.alive &&
			  enemy.bullets  &&
		  this.game.time.now > firingDelay + enemy.lastShot) {
			enemy.lastShot = this.game.time.now;
			enemy.bullets--;
			enemyBullet.reset(enemy.x, enemy.y + enemy.height / 2);
			enemyBullet.damageAmount = enemy.damageAmount;

			var angle = this.game.physics.arcade.moveToObject(enemyBullet, this.player, bulletSpeed);
	
			enemyBullet.angle = 180-  this.game.math.radToDeg(angle);
		//	console.log("Z" + enemyBullet + "" + this.player +"]" + bulletSpeed + " angle " + angle + " " + this.game.math.radToDeg(angle) + " " );
		}
		
	},

	 enemyHitsPlayer: function (player, bullet) {

		bullet.kill();

		this.player.damage(bullet.damageAmount);
		this.shields.render.call(this)
		
		 if (this.player.alive) {
	        var explosion = this.explosions.getFirstExists(false);
	        explosion.reset(this.player.body.x + this.player.body.halfWidth, this.player.body.y + this.player.body.halfHeight);
	        explosion.alpha = 0.7;
	        explosion.play('explosion', 30, false, true);
	    } else {
	        this.playerDeath.x = this.player.x;
	        this.playerDeath.y = this.player.y;
	        this.playerDeath.start(false, 1000, 10, 10);
	    }
},
	
	addEnemyEmitterTrail: function(enemy) {
		var enemyTrail = this.game.add.emitter(enemy.x, this.player.y - 10, 100);
		if (1) {
		enemyTrail.width = 10;
		enemyTrail.makeParticles('explosion', [1,2,3,4,5]);
		//enemyTrail.makeParticles('laserExplode', [1,2,3,4,5]);
		enemyTrail.setXSpeed(20, -20);
		enemyTrail.setRotation(50,-50);
		enemyTrail.setAlpha(0.4, 0, 800);
		enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
		//enemyTrail.setScale(0.1, 1, 0.1,1, 1000, Phaser.Easing.Quintic.Out);
	}
		enemy.trail = enemyTrail;
},

	explosionPool: function() {
		
		//  An explosion pool
		this.explosions = this.game.add.group();
		this.explosions.enableBody = true;
		this.explosions.physicsBodyType = Phaser.Physics.ARCADE;
		this.explosions.createMultiple(30, 'explosion');
		this.explosions.setAll('anchor.x', 0.5);
		this.explosions.setAll('anchor.y', 0.5);
		this.explosions.forEach( function(explosion) {
			explosion.animations.add('explosion');
		});
	},


//OPTIMIZE UPDATE!
//function update(){  if (game.time.time> timeout) {      call_your_function();      timeout= game.time.time+2000;   }  // ... your code}
	update: function () {
		//  Scroll the background
		this.starfield.tilePosition.y += 2;
		

    //  Fire bullet
    if (this.player.alive && (this.fireButton.isDown || this.game.input.activePointer.isDown)) {
        this.fireBullet();
    }
		//this.player.body.velocity.setTo(0, 0);
		//We set the aceleration for x to 0... and increase the velocity
		this.player.body.acceleration.x = 0;
	    if (this.cursors.left.isDown)
	    {
	        this.player.body.velocity.x = -this.ACCELERATION;
	    }
	    else if (this.cursors.right.isDown)
	    {
	        this.player.body.velocity.x = this.ACCELERATION;
	    } else 	        //  Move ship towards mouse pointer
	    //TODO maybe click?
		if ( this.game.input.x <  this.game.width - 20 &&
			this.game.input.x > 20 &&
			this.game.input.y > 20 &&
			this.game.input.y < this.game.height - 20) {
			var minDist = 200;
			var dist =  this.game.input.x -  this.player.x;
			 this.player.body.velocity.x =  this.MAXSPEED *  this.game.math.clamp(dist / minDist, -1, 1);
		}
	    
	    
			 //  Stop at screen edges
	    if (this.player.x > this.game.width - 50) {
	        this.player.x = this.game.width - 50;
	        this.player.body.acceleration.x = 0;
	    }
	    if (this.player.x < 50) {
	       this.player.x = 50;
	        this.player.body.acceleration.x = 0;
	    }
	    


	    
	     //  Squish and rotate ship for illusion of "banking"
	    this.bank = this.player.body.velocity.x / this.MAXSPEED;
	    this.player.scale.x = 1 - Math.abs(this.bank) / 4;
	    this.player.angle = this.bank * 30; //*10;
	  
	    //  Keep the shipTrail lined up with the ship
	    this.shipTrail.x =this.player.x;
	    
	    
	       //  Check collisions
		this.game.physics.arcade.overlap(this.player, this.enemies['red'], this.shipCollide, null, this);
		this.game.physics.arcade.overlap(this.enemies['red'], this.bullets, this.hitEnemy, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemies['blue'], this.shipCollide, null, this);
		this.game.physics.arcade.overlap(this.enemies['blue'], this.bullets, this.hitEnemy, null, this);
		this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
		this.verifyGameOver();
	},
	verifyGameOver: function() {
		//  Game over?
		if (! this.player.alive && this.gameOver.visible === false) {
		
			this.gameOver.visible = true;
			this.gameOver.alpha = 0;
			var fadeInGameOver = this.game.add.tween(this.gameOver);
			fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
		//ALWAYS put the function before the oncomplete!
			function setResetHandlers() {
				//  The "click to restart" handler
				tapRestart = this.game.input.onTap.addOnce(_restart,this);
				spaceRestart = this.fireButton.onDown.addOnce(_restart,this);
				function _restart() {
					 tapRestart.detach();
					 spaceRestart.detach();
					 this.restart();
				}
			}
			
			fadeInGameOver.onComplete.add(setResetHandlers,this);
			fadeInGameOver.start();
		}
    
	},
	
	
	//TODO score...
	//TODO Drop something:)
	hitEnemy: function(enemy, bullet) {
		var explosion = this.explosions.getFirstExists(false);
		//These all search for the center of the body, best to use the enemy center instead of tthe bullet but we'll see
		
		//explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
		//OR
	//	explosion.reset(enemy.x , enemy.y);
		//explosion.anchor.set(0.5, 0.5);
		explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
		explosion.body.velocity.y = enemy.body.velocity.y;
		explosion.alpha = 0.7;
		explosion.play('explosion', 30, false, true);
		enemy.kill();
		bullet.kill();
		this.explodeSound.play();
		  // Increase score
		  
		CyberPro.highscore.currentScore = this.score += enemy.damageAmount * 10;
		CyberPro.saveHighscore();
		this.scoreText.render.call(this);

		
		//  Pacing
		//  Enemies come quicker as score increases
		this.redEnemySpacing *= 0.9;
		//  Blue enemies come in after a score of 1000
		if (!this.blueEnemyLaunched && this.score > 1000) {
			this.blueEnemyLaunched = true;
			this.launchBlueEnemy('blue');
			//  Slow green enemies down now that there are other enemies
			this.redEnemySpacing *= 2;
		}
		
	   //  Weapon upgrade
		if (this.score > 4000 && this.player.weaponLevel < 2) {
		  this.player.weaponLevel = 2;
		}
	},
	
	//TODO -10 shield on impact
	shipCollide: function(player, enemy) {
		//explosion.body.velocity.y = enemy.body.velocity.y;

		enemy.kill();
		//Damage the player..
	    player.damage(enemy.damageAmount);
	    //since the render original has "this" as the local value.. 
	    //we need to assign it the global value of our object via call(this,arg1,arg2,...)
		this.shields.render.call(this);
		
		 if (this.player.alive) {
	        var explosion = this.explosions.getFirstExists(false);
	        explosion.reset(this.player.body.x + this.player.body.halfWidth, this.player.body.y + this.player.body.halfHeight);
	        explosion.alpha = 0.7;
	        explosion.play('explosion', 30, false, true);
	    } else {
	        this.playerDeath.x = this.player.x;
	        this.playerDeath.y = this.player.y;
	        this.playerDeath.start(false, 1000, 10, 10);
	    }
	},
	/*
	 fireBullet: function() {
		 //  To avoid them being allowed to fire too fast we set a time limit
		if (this.game.time.now > this.bulletTimer)
		 {
			var BULLET_SPEED = 400;
			var BULLET_SPACING = 250;
		   //  Grab the first bullet we can from the pool
			var bullet = this.bullets.getFirstExists(false);

			if (bullet)
			{
					this.laserSound.play();
				//  And fire it
		//		bullet.reset(this.player.x, this.player.y + 8);
		//		bullet.body.velocity.y = -400;
		
				//  Make bullet come out of tip of ship with right angle
				var bulletOffset = 20 * Math.sin(this.game.math.degToRad(this.player.angle));
				bullet.reset(this.player.x + bulletOffset, this.player.y);
				bullet.angle = this.player.angle;
				this.game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
				bullet.body.velocity.x += this.player.body.velocity.x;
				this.bulletTimer = this.game.time.now + BULLET_SPACING;
			}
		}
	},*/
	
	//TODO all and well.. modify that user can get a specific "upgrade" box:)
	fireBullet: function() {
    switch (this.player.weaponLevel) {
        case 1:
        //  To avoid them being allowed to fire too fast we set a time limit
        if (this.game.time.now > this.bulletTimer)
        {
            var BULLET_SPEED = 400;
            var BULLET_SPACING = 250;
            //  Grab the first bullet we can from the pool
            var bullet = this.bullets.getFirstExists(false);

            if (bullet)
            {
					this.laserSound.play();
                //  And fire it
                //  Make bullet come out of tip of ship with right angle
                var bulletOffset = 20 * Math.sin(this.game.math.degToRad(this.player.angle));
                bullet.reset(this.player.x + bulletOffset, this.player.y);
                bullet.angle = this.player.angle;
                this.game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
                bullet.body.velocity.x += this.player.body.velocity.x;

                this.bulletTimer = this.game.time.now + BULLET_SPACING;
            }
        }
        break;

        case 2:
        if (this.game.time.now > this.bulletTimer) {
            var BULLET_SPEED = 400;
            var BULLET_SPACING = 550;


            for (var i = 0; i < 3; i++) {
                var bullet = this.bullets.getFirstExists(false);
                if (bullet) {
                    //  Make bullet come out of tip of ship with right angle
                    var bulletOffset = 20 * Math.sin(this.game.math.degToRad(this.player.angle));
                    bullet.reset(this.player.x + bulletOffset, this.player.y);
                    //  "Spread" angle of 1st and 3rd bullets
                    var spreadAngle;
                    if (i === 0) spreadAngle = -20;
                    if (i === 1) spreadAngle = 0;
                    if (i === 2) spreadAngle = 20;
                    bullet.angle = this.player.angle + spreadAngle;
                    this.game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                    bullet.body.velocity.x +=this. player.body.velocity.x;
                }
               this.bulletTimer = this.game.time.now + BULLET_SPACING;
            }
			this.laserSound.play();
        }
    }
},

/*
	render:function() {
		if (0) {
		   for (var i = 0; i < this.redEnemies.length; i++)
			 {
				 this.game.debug.body(this.redEnemies.children[i]);
			 }
			 this.game.debug.body(this.player);
		 }
		 //show FPS
		// 	this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
	},
	*/
		/* TODO when the enemy hits the player.. we kill the blue enemies.. and remove the blue enemy launcher
	 * we also reset the spacing of the green enemies.. (seems it's too difficult for youm ah?)
	 *  function enemyHitsPlayer (player, bullet) {
...
     greenEnemies.callAll('kill');
     game.time.events.remove(greenEnemyLaunchTimer);
     game.time.events.add(1000, launchGreenEnemy);
+    blueEnemies.callAll('kill');
     blueEnemyBullets.callAll('kill');
+    game.time.events.remove(blueEnemyLaunchTimer);
 
     blueEnemies.callAll('kill');
     game.time.events.remove(blueEnemyLaunchTimer);
...
     //  Hide the text
     gameOver.visible = false;
 
+    //  Reset pacing
+    greenEnemySpacing = 1000;
+    blueEnemyLaunched = false;
 },*/
	
	 restart: function() {
		 var enemyType ='red';
	    //  Reset the enemies
	    this.enemies[enemyType].callAll('kill');
	    this.game.time.events.remove(this.enemies[enemyType].redEnemyLaunchTimer);
	    this.game.time.events.add(1000, this.launchEnemy,this,'red');
	
		var enemyType ='blue';
		this.enemies[enemyType].callAll('kill');
		this.game.time.events.remove(this.enemies[enemyType].blueEnemyLaunchTimer);
		//this.game.time.events.add(4000, this.launchEnemy,this,enemyType);
		
		this.enemyBullets.callAll('kill');

	    //  Revive the player
	    this.player.weaponLevel = 1;
	   this.player.revive();
	    this.player.health = 100;
	    this.shields.render.call(this);
	  CyberPro.highscore.currentScore =  this.score = 0;
	    this.scoreText.render.call(this);
		  //  Hide the text
	    this.gameOver.visible = false;
	    
	     //  Reset pacing
		this.greenEnemySpacing = 1000;
		this.blueEnemyLaunched = false;
	
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
