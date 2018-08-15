
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

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    
	// the square!! the hero of the game
	this.ourHero;
	// square's horizontal speed in pixels/frame
	this.xSpeed=4;
	// square's jump height, in pixels
	this.jumpHeight=50;
	// square's jump width, in pixels. xSpeed must divide jumpWidth
	this.jumpWidth=120;
	// rotation performed at every jump, in degrees
	this.jumpRotation=180;
	// time passed since the player started jumping, in frames
	this.jumpTime=0;
	// is the player jumping?
	this.isJumping=false;
	// simple degrees to radians conversion
	this.degToRad=0.0174532925;
	// array containing all various floor y positions, in pixels
	//this.floorY=Array(92,184,276,368,460);
		this.floorY=Array(150,300,450);
	// floor I am currently moving on	
	this.currentFloor=0;
	// floor height, in pixels
	this.floorHeight=20;
	// x position where the level starts, in pixels
	this.levelStart=0;
	// x position where the level ends, in pixels
	this.levelEnd=640;	
	this.heroHeight = 176;
}; 

BasicGame.Game.prototype = {

	create: function () {
		  this.game.stage.backgroundColor = "#4488AA";
		// simply drawing all floors, as lines from levelStart to levelEnd, tickness floorHeight
		this.floor = this.game.add.graphics(0,0);
		this.floor.lineStyle(this.floorHeight, 0x440044, 1);		
		for(i=0;i<this.floorY.length;i++){				
			this.floor.moveTo(this.levelStart,this.floorY[i]+this.floorHeight/2);
			this.floor.lineTo(this.levelEnd,this.floorY[i]+this.floorHeight/2);
		}
		// adding the hero
		 //  player = game.add.sprite(32, game.world.height - 150, 'dude');
		this.ourHero=this.game.add.sprite(this.levelStart,this.floorY[this.currentFloor]-this.game.cache.getImage("hero").height/2,"hero");		
		this.ourHero.animations.add('running', null, null, true);
		this.ourHero.anchor.setTo(0.5,0.5);
		// event listener for mouse down
		this.game.input.onDown.add(this.jump, this);
		
		//Add listener for ENTER and SPACE keys
		var eventKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		eventKey.onDown.add(this.jump,this);
		var eventKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		eventKey.onDown.add(this.jump,this);
		this.ourHero.animations.play('running');
	},

	update: function () {
		// temp variable to let us know if we are on an odd or even floor
		var mod=this.currentFloor%2;
		// updating square x position
		this.ourHero.x+=this.xSpeed*(1-2*mod);
		// if the square reached the end of the floor...
		if (this.ourHero.x>this.levelEnd && mod==0 || this.ourHero.x< this.levelStart && mod==1) {
			// move onto next floor
			this.currentFloor++;
			// if we just finished the lowest floor...
			if (this.currentFloor>this.floorY.length-1) {
				// start the game again
				this.ourHero.scale.x *= -1;
				this.currentFloor=0;
			}
			// even or odd?
			mod=this.currentFloor%2
			// we start on the ground
			this.isJumping=false;
			this.ourHero.rotation=0;
			this.ourHero.x=this.levelEnd*mod+this.levelStart*(1-mod);
			this.ourHero.y=this.floorY[this.currentFloor]-this.game.cache.getImage("hero").height/2;
			this.ourHero.scale.x *= -1;
		}
		// if we are jumping...
		if (this.isJumping) {
			// calculating the number of frames we will be jumping
			var jumpFrames=this.jumpWidth/this.xSpeed;
			// calculating how many degrees should the square rotate at each frame
			var degreesPerFrame=this.jumpRotation/jumpFrames*(1-2*mod);
			// calculating how may radians we have to apply to sine trigonometry function to simulate player jump
			var radiansPerFrame=(180/jumpFrames)*this.degToRad
			// anohter frame jumping...
			this.jumpTime++;
			// updating rotation
		//	this.ourHero.angle+=degreesPerFrame;  
			// updating y position
			this.ourHero.y=this.floorY[this.currentFloor]-this.game.cache.getImage("hero").height/2-this.jumpHeight*Math.sin(radiansPerFrame*this.jumpTime);
			// if we jumped enough...
			console.log("Jumping " +jumpFrames + " radiansperframe " + radiansPerFrame + " degrees " +degreesPerFrame + " jumpTime " + this.jumpTime + " square " + this.ourHero.y);
			if (this.jumpTime==jumpFrames) {
				console.log("We jumped enough!");
				// ... just stop jumping
				this.isJumping=false;
				this.ourHero.y=this.floorY[this.currentFloor]-this.game.cache.getImage("hero").height/2;
			}
		}
	},



	jump: function(){
			// if we aren't jumping... then JUMP!!
		if (!this.isJumping) {
			this.jumpTime=0;
			this.isJumping=true;
		}	
	},


	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
