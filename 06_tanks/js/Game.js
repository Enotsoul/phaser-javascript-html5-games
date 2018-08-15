
BasicGame.Game = function (game) {

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

	this.nextFire = 0;
	this.fireRate = 500;

};

BasicGame.Game.prototype = {

	create: function () {
		//TODO loading map..
		//  Resize our game world to be a 2000 x 2000 square
		this.game.world.setBounds(-1000, -1000, 2000, 2000);
		
    //  Our tiled scrolling background
		this.bg =  this.land  = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'tanks','sand.png');
		this.land.fixedToCamera = true;

		
	//	this.player = this.add.sprite(this.world.centerX, this.world.height - this.cache.getImage('tanks').height*3/2, 'tanks');
		this.createPlayer();
	
		this.cratesGroup();
		this.speed = 500;
		this.acceleration = 10;
		//follow the player
		this.game.camera.follow(this.player);
		 //The deadzone is the location where we won't follow the user  150 px arround the game
		 //thisleaves enough space to maneouver and view things in screen
		this.game.camera.deadzone = new Phaser.Rectangle(150, 150, this.camera.width-150, this.camera.height-150);
		this.game.camera.focusOnXY(0, 0);
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		for (var i = 0; i < 100; i++)
		{
			var x = this.rnd.integerInRange(0,this.game.width);
			var y = this.rnd.integerInRange(0,this.game.height);
			this.placeRandomCrate(x,y);
			console.log("Placed at " +x + " ," +y);
		}
		

	},
	createPlayer: function() {
		this.player = this.add.sprite(this.world.centerX, this.world.centerY , 'tanks','tankGreen_outline.png');

		this.player.health = 100;
		this.player.anchor.setTo(0.5, 0.5);
		//needed to solve out issues with the turret
		this.player.angle = 90;
		   //  This will force it to decelerate and limit its speed
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.drag.set(0.2);
		this.player.body.maxVelocity.setTo(400, 400);
		this.player.body.collideWorldBounds = true;
		
		   //  Finally the turret that we place on-top of the tank body
		this.player.turret = this.game.add.sprite(0, 0, 'tanks', 'barrelGreen_outline.png');
		this.player.turret.anchor.setTo(0.5, 0.2);
		//this.player.turret.angle = 90;
	//	this.player.turret.angle = this.math.degToRad(180);
	
		this.createBullets();
		
	},
	createBullets: function() {
		//  Our bullet group
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(30, 'tanks', 'bulletGreen_outline.png', false);
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);
	//	this.bullets.setAll('angle', 180);
	},
	cratesGroup: function() {
		//  Our bullet group
		this.crates = this.game.add.group();
		this.crates.enableBody = true;
		this.crates.physicsBodyType = Phaser.Physics.ARCADE;
		this.crates.createMultiple(30, 'tanks2', null, false);
		this.crates.setAll('anchor.x', 0.5);
		this.crates.setAll('anchor.y', 0.5);
		this.crates.setAll('outOfBoundsKill', true);
		this.crates.setAll('checkWorldBounds', true);
		this.crates.setAll('body.immovable', true);
		//this.crates.setAll('body.moves', false);
		//this.bullets.setAll('angle', 180);
	},
	update: function () {
		//Make it so we can't go through..
		this.game.physics.arcade.collide(this.player, this.crates);
		this.player.body.velocity.set(0);
		if (this.cursors.left.isDown)
		{
			this.player.body.velocity.x = -this.speed;
		}
			else if (this.cursors.right.isDown)
		{
			this.player.body.velocity.x = this.speed;
		}
		if (this.cursors.up.isDown)
		{
			this.player.body.velocity.y = -this.speed;
		}
		else if (this.cursors.down.isDown)
		{
			this.player.body.velocity.y = this.speed;
		}
	
		//Move the turret with the game
		this.player.turret.x = this.player.x;
		this.player.turret.y = this.player.y;
		
		
		//Move the turret where the location of the pointer is:)
		//Howver since our player is rotated by 90..we need to rotate the turret based on the player rotation
		this.player.turret.rotation = this.game.physics.arcade.angleToPointer(this.player.turret);
		this.player.turret.rotation -= this.player.rotation;
		
		if (this.game.input.activePointer.isDown)
		{
			//  Boom!
			this.fireBullet();
		}
		
		
	},
	fireBullet:function() {
		//We want to limit the next fire..
		if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
		{
			this.nextFire = this.game.time.now + this.fireRate;

			var bullet = this.bullets.getFirstExists(false);

			bullet.reset(this.player.turret.x, this.player.turret.y);

			bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1000, this.game.input.activePointer, 500);
			bullet.rotation += this.player.rotation;
		}
		
	},
	placeRandomCrate(x,y) {
		var crate = this.crates.getFirstExists(false);
		var types = ['tanks_crateWood.png','tanks_barrelGreen.png','tanks_barrelGrey.png','tanks_barrelRed.png'];
		var type = types[this.rnd.integerInRange(0,types.length-1)];
		if (crate) {
			 crate.reset(x, y);
			 crate.frameName = type;
			 crate.width =50;
			 crate.height =50;
			
		}
	},
	//Placing a goodie
	/*
	 * Bullets (20)
	 * Shield (+10)
	 * Upgrade
	 */
	placeGoodie(x,y,type) {
		var goodies = ['tanks_crateAmmo.png','tanks_crateArmor.png','tanks_crateRepair.png']
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
