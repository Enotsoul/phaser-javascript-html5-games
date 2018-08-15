
SpaceDestiny.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

SpaceDestiny.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar

		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.

		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	You can find all of these assets in the Phaser Examples repository

		//TODO use texture atlas from xml see example at
	// 	https://phaser.io/examples/v2/loader/load-starling-atlas
	
		this.load.image('starfield', 'assets/Backgrounds/darkPurple.png');		
		this.load.image('ship', 'assets/PNG/playerShip2_blue.png');
		this.load.image('bullet', 'assets/PNG/Lasers/laserBlue07.png');
		this.load.image('enemyBullet', 'assets/PNG/Lasers/laserRed05.png');
		this.load.image('laserExplode', 'assets/PNG/Lasers/laserBlue08.png');
		this.load.spritesheet('explosion', 'assets/explode.png',128,128);
		this.load.image('fire', 'assets/PNG/Effects/fire00.png');
		
		for (var i = 1; i < 20; i++)
        {
       		//this.load.image('spritesheet'+i, 'assets/Spritesheet/sheet.png?rnd=' +  (i *(i+1)));
        }
		
		this.load.image('enemy-red', 'assets/PNG/Enemies/enemyRed1.png');
		this.load.image('enemy-black', 'assets/PNG/Enemies/enemyBlack3.png');
		this.load.image('enemy-blue', 'assets/PNG/Enemies/enemyBlue4.png');
		
		this.load.audio('laser_sound', 'assets/Bonus/sfx_laser1.ogg');	
		this.load.audio('music', 'assets/Ten-Josai-01.ogg');	
		//TODO wav to ogg for speed
		this.load.audio('blast', 'assets/blast.wav');	
		
		//Import bitmapfont (xml can be .fnt)
		// this.load.xml("spacefont.xml", "assets/Bonus/spacefont.fnt");
		this.load.bitmapFont('spacefont', 'assets/Bonus/spacefont.png', 'assets/Bonus/spacefont.fnt');  
	},

	create: function () {
	   //  The load is now finished, loadUpdate won't run any more, so fade out the spinner
      //  this.add.tween(this.spinner.scale).to( { x: 0, y: 0 }, 1000, "Elastic.easeIn", true, 250);
        //this.add.tween(this.text).to( { alpha: 0 }, 1000, "Linear", true);

		this.state.start('MainMenu');

	}

};
