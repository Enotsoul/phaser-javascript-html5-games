
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
			CyberPro.init('ChubbyBirds');
};

BasicGame.Game.prototype = {

    create: function () {
			CyberPro.init('ChubbyBirds');
		//30 frames suffice so it runs well on mobile
			this.game.time.desiredFps = 30;
		//blue background
		this.background = this.add.sprite(0, 0, 'gamebackground');
		this.clouds = this.add.tileSprite(0, 0,1920,1080, 'clouds');
		this.bottomGrass = this.add.group();
		for (i = 0; i < 9; i++)
		{
			var grass = this.add.sprite(i*70,this.game.world.height-35,'grass');
			this.physics.arcade.enable(grass);
			this.bottomGrass.add(grass);
					
		}
		
		this.stage.backgroundColor = '#71c5cf';
		this.jumpSound = this.add.audio('jump'); 
		this.whackSound = this.add.audio('whack'); 
		
		 // Set the physics system
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
			
		// Display the bird at the position x=100 and y=245
		this.bird = this.game.add.sprite(100, 100, 'bird');
		this.bird.animations.add('flying', null, 10, true);


		// Add physics to the bird
		// Needed for: movements, gravity, collisions, etc.
		this.physics.arcade.enable(this.bird);
		//Collision circle:)
		this.bird.body.setCircle(25,15);
		this.bird.body.collideWorldBounds=true;
		
		   // Add gravity to the bird to make it fall
		this.bird.body.gravity.y = 1000;  
		this.bird.anchor.set(0.5);
		//make like original bird.. with location
		//this.bird.anchor.setTo(-0.2, 0.5); 
		//TODO click with mouse
		 // Call the 'jump' function when the spacekey is hit
		var spaceKey = this.input.keyboard.addKey(
						Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);   
		//		spaceKey= this.input.activePointer.leftButton.isDown
  
		this.input.onDown.add(this.jump, this);
		
		// Create an empty group
		this.boxes = this.add.group(); 

		//this.timer = this.time.events.loop(1700, this.addRowOfBoxes, this); 
		this.timer = this.time.events.add(1700, this.addRowOfBoxes, this); 
		
	
		CyberPro.highscore.currentScore = this.score = 0;
		this.highScoreLabels();
		this.bird.animations.play('flying');
	},
    
    addOneBox: function(x, y,tile=0,type='normal') {

		//Add random box/pipe
		// Create a box at the position x and y
	//	console.log('adding box at' + rnd);
	
		if (isInArray(type, ['bottom','top']))
			tile++;
		var box = this.add.sprite(x, y, 'boxes',tile);
		if (type == 'top')  {
			box.anchor.setTo(0,1);
			box.scale.y *= -1;
		
		}
	//	this.balls.create(x, y, 'balls', color);

		// Add the box to our previously created group
		this.boxes.add(box);

		// Enable physics on the box 
		this.physics.arcade.enable(box);

		// Add velocity to the box to make it move left
		box.body.velocity.x = -200; 

		// Automatically kill the box when it's no longer visible 
		box.checkWorldBounds = true;
		box.outOfBoundsKill = true;
	},
	
	addRowOfBoxes: function(time=1700) {
		// Randomly pick a number between 1 and 7
		// This will be the hole position
		var hole = this.rnd.between(0,7)
	
		rndTile = this.rnd.between(0,4)*2;

		// Add the 6 boxes 
		// With one big hole at position 'hole' and 'hole + 1'
		for (var i = 0; i < 10; i++)
			//if (i != hole && i != hole + 1 && i != hole + +2) 
			if (i != hole && i != hole + 1)  {
				type = 'normal';
				if (hole-1==i) 
					type = 'top';
				if (hole+2 ==i) 
					type = 'bottom';
				this.addOneBox(this.game.width, i * 70,rndTile,type);
			}  
				
		CyberPro.highscore.currentScore = this.score += 1;
		CyberPro.saveHighscore();
		this.updateHighScore();
		this.game.time.events.remove(this.timer);
	//Add the timer with a random time between 1.3 and 2.5 seconds
		time = this.rnd.between(1500,2500);
		this.timer = this.time.events.add(time, this.addRowOfBoxes, this); 
	},

    update: function () {
		this.clouds.tilePosition.x -= 0.5;
		//change the angle downwards when it falls
		if (this.bird.angle < 20)
			this.bird.angle += 1; 
		//When the bird overlaps with any box
		this.physics.arcade.overlap(this.bird, this.boxes, this.hitBox, null, this);

		/*
		 This replaces this.bird.body.collideWorldBounds=true;
		 * This:
		if (this.bird.alive == true) {
			if (this.bird.y < 0) 
				this.bird.y=this.bird.height;
			if (this.bird.y > 600-this.bird.height/2) {
				this.bird.y=600-this.bird.height;
				
			}
		}*/

    },
	highScoreLabels: function() {
		this.labelScore = this.add.text(20, 20, "Score: " +CyberPro.highscore.currentScore, 
			{ font: "30px Arial", fill: "#ffffff" }); 
		this.labelBestScore = this.add.text(20, 50, "Best: " + CyberPro.highscore.bestScore, 
			{ font: "30px Arial", fill: "#ffffff" }); 
	},

	updateHighScore: function() {
		CyberPro.getHighscore();
		this.labelScore.text = "Score: " + CyberPro.highscore.currentScore;   
		this.labelBestScore.text = "Best: " + CyberPro.highscore.bestScore;   
	},

    // Make the bird jump 
	jump: function() {
		//if the bird is not alive.. don't let it jump'
		if (this.bird.alive == false)
			return;
			
			this.jumpSound.play(); 
		// Add a vertical velocity to the bird
		this.bird.body.velocity.y = -350;
					
	//Create an animation on the bird that changes the angle to -20 in 100 milliseconds
	/*
			var animation = this.game.add.tween(this.bird);
		animation.to({angle: -20}, 100);
		animation.start(); 
		*/
		var animation = this.add.tween(this.bird).to({angle: -20}, 100).start(); 
	},
	
	hitBox: function() {
		// If the bird has already hit a box, do nothing
		// It means the bird is already falling off the screen
		if (this.bird.alive == false)
			return;
			
		this.whackSound.play();

		// Set the alive property of the bird to false
		this.bird.alive = false;

		// Prevent new boxes from appearing
		this.time.events.remove(this.timer);

		// Go through all the boxes, and stop their movement
		this.boxes.forEach(function(p){
			p.body.velocity.x = 0;
		}, this);
		this.add.tween(this.bird).to({y: 600}, 700).start().onComplete.add(this.restartGame,this);; 
		
		//Save HighScore
		
		CyberPro.saveHighscore(CyberPro.highscore.currentScore);
		this.updateHighScore();
	}, 
		// Restart the game
	restartGame: function() {
		// Start the 'main' state, which restarts the game
		this.state.start('Game');
	},
	render: function () {
		
		//this.game.debug.body(this.bird);
	},

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
