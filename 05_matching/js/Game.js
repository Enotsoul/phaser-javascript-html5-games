
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

this.levels = {
	1:{ y:2 , x:3  },	
	2:{ y:2 , x:4  },	
	3:{ y:3 , x:4  },	
	4:{ y:4 , x:4  },	
	5:{ y:4 , x:5  },	
	6:{ y:4 , x:6  },	
	7:{ y:5 , x:6  },	
	8:{ y:6 , x:6  },	
	9:{ y:6 , x:7  },	
	10:{ y:6 , x:8  },	
	11:{ y:7 , x:8  },	
};
};
function createMatrix(N, M) {
    var matrix = []; // Array with initial size of N, not fixed!

    for (var i = 0; i < N; ++i) {
        matrix[i] = [];
    }

    return matrix;
}
function generateFrameName (nr) {
	if (nr/100>=1) {
		var append='';
	} else if (nr/10 >= 1) {
		var append='0';
	} else {
		var append ='00';
	}
	return 'genericItem_color_'+append +""	+nr+'.png';
}
BasicGame.Game.prototype = {

    create: function () {
		var shapeIndex=i=0;
		this.width = 140;
		this.height = 140;
		this.boxes = this.game.add.group();
		this.shapes = this.game.add.group();
	
		this.shapes.createMultiple(5, 'genericItems');
		this.shapes.setAll('anchor.x', 0.5);
		this.shapes.setAll('anchor.y', 0.5);
		
		this.currentLevel = 1;
		this.boardSize = {y:4 , x:3};
		this.select1 = null;
		this.select2=null;
		this.select=[];
		this.totalMoves =0;
		this.toggle=true;
		this.score = 0;
		this.canClick=true;
		this.matches = [];
		this.totalMatches =0;
		
		this.txtMoves = this.add.text(10,10,"Moves: "+this.totalMoves,{font: "40px Arial",fill:'#33EF3F'});
	
		this.txtMoves.render= function () {
			this.txtMoves.text ="Moves: "+this.totalMoves;
		};
		this.txtScore = this.add.text(this.txtMoves.width+50,10,"Score: "+this.totalMoves,{font: "40px Arial",fill:'#33EF3F'});
		this.txtScore.render= function () {
			this.txtScore.text ="Score: "+this.score;
		};
		this.txtLevel = this.add.text(this.txtMoves.width+this.txtScore.width+100,10,"Level: "+this.currentLevel,{font: "40px Arial",fill:'#33EF3F'});
		this.txtLevel.render= function () {
			this.txtLevel.text ="Level: "+this.currentLevel;
		};
	//	this.hiddenBox = this.add.sprite(width ,height,'hiddenBox');
		this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	//	this.youWon();
		this.generateLevel(1);

	
	//	this.input.onDown.add(this.selectBox, this);
		
    },
    		//Empty up the matches so we don't have lingering objects laying arround
    		
    cleanupLevel: function() {
		 for (var i = 0; i < 	this.matches.length ; i++) {
			 this.matches[i].kill();
		 }
		 this.matches = [];
	},
	youWon:function() {
	//TODO give stars on how much moves it took..(calculate a good ratio)
		this.totalMoves =0 ;
			
		emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY*2/3, 200);
		var ok = []
		for (i = 0; i < 100; i++)
		{
			rnd = generateFrameName(this.rnd.integerInRange(1,163));
		//	console.log("random stuff " + rnd);
			ok.push(rnd);
		}
		
		//  Here we're passing an array of image keys. It will pick one at random when emitting a new particle.
		emitter.makeParticles('genericItems',ok,200);


		emitter.setXSpeed(-this.game.world.width/2, this.game.world.width/2);
		emitter.setYSpeed(-this.game.world.height/2, this.game.world.width/2);
		emitter.setRotation(-180,180);
		emitter.setAlpha(1, 0.01, 800);
		emitter.setScale(0.05, 0.5, 0.05, 0.5, 2000, Phaser.Easing.Bounce.Out);//Qunitic
		emitter.start(false, 5000, 20);
    
	
	
		this.gameOver = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'You Won! ', { font: '84px tahoma', fill: '#fff' });
		this.gameOver.anchor.setTo(0.5, 0.5);
		
		this.gameOver.alpha = 0;
		var fadeInGameOver = this.game.add.tween(this.gameOver);
		fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
		fadeInGameOver.onComplete.add(setResetHandlers,this);
		fadeInGameOver.start();

    
		function setResetHandlers() {
			//  The "click to restart" handler
			tapRestart = this.game.input.onTap.addOnce(_restart,this);
			spaceRestart = this.fireButton.onDown.addOnce(_restart,this);
			function _restart() {
				 tapRestart.detach();
				 spaceRestart.detach();
				 emitter.kill();
				 this.gameOver.visible = 0;
				 this.nextLevel();
			}
		}
	},
    nextLevel:function () {
		this.generateLevel(this.currentLevel+=1);
		this.cleanupLevel();
	},
    generateLevel:function (level) {
		this.currentLevel = level;
		this.boardSize = this.levels[level];
		this.txtLevel.render.call(this);

		
		
		for (var y = 1; y <= this.boardSize.y; y++)
		{
			for (var x = 1; x <= this.boardSize.x; x++) 		{
		
			//	var box = this.add.sprite(width*x +x*5-5 ,height*y+y*5-5,'hiddenBox');
			var shape =  this.shapes.getFirstExists(false,true,this.width*x +x*3-3 ,this.height*y+y*3-3,'genericItems');
		if (shape) {
			//shape.reset(this.game.rnd.integerInRange(0, this.game.width), -20);
			//	this.shapesArr[x][y] =sprite;
			//	this.shapes[i] = sprite;
				shape.name = "shape"+ x+","+y;
			//	box.location  = 	
				shape.location = {x: x, y:y};
			//	box.scale.setTo(0,1);
				shape.inputEnabled = true;
				shape.events.onInputDown.add(this.selectBox,this);
				//shape.scale.setTo(0.5);
				shape.anchor.setTo(0.5);
				shape.frameName = 'hiddenBox';
			//	shape.original = generateFrameName(this.rnd.integerInRange(0,163));
				shape.randomization = this.rnd.integerInRange(0,1000);
			
			//	this.boxes.add(box);
				this.shapes.add(shape);
		
				this.matches.push(shape);

			 //  this.add.tween(shape.scale).to({x:1,y:1}, 1000, Phaser.Easing.Bounce.Out, true);
		 	} else 
			console.log("no shape for us" + shape);
		
			}
			
		}
	
		this.matches = Phaser.ArrayUtils.shuffle(this.matches);
	
		for (var i = 0; i < 	this.matches.length ; i+=2)
		{
			rnd =generateFrameName(this.rnd.integerInRange(1,163));
			this.matches[i].original = rnd;
			this.matches[i+1].original = rnd;
			this.totalMatches++;
			console.log('i and i +1' +i  +' rnd ' + rnd);
		}
		this.shapes.forEach(function (box) {
		
		//	console.log("box " +box.original + " ");
		},this);


	},
    
    selectBox:function(box) {
		this.currentMove++;
		if (!this.canClick) 
			return 0;
			this.canClick=0;
		//this.canClick = false;
		this.totalMoves++;
	//	console.log("Selected " + box.name);
		var card = this.boxes.iterate('location', box.location, Phaser.Group.RETURN_CHILD);
		var width = box.width;
		var height;
	
		t1= this.add.tween(box.scale).to({ x:0,y:1}, 500, Phaser.Easing.Sinusoidal.InOut, false);
	//	box.frameName = generateFrameName(this.rnd.integerInRange(0,163));
		t1.onComplete.add(function() {
		//	box.frameName = generateFrameName(this.rnd.integerInRange(0,163));
			box.frameName = box.original;
		//	 console.log('complete!' + box.frameName);
			}			,this,'',box)
//		box.tint = 0x41B448;
		
		t2=this.add.tween(box.scale).to({ x:1,y:1}, 500, Phaser.Easing.Sinusoidal.InOut, false);
		t1.chain(t2);
		t1.start();
	//	box =  this.hiddenBox;
		//box.frameName ='hiddenBox';
		if (this.toggle) {
			this.select[1] = box;
			box.inputEnabled = false;
			this.canClick=1;
			this.toggle=false;
		} else {
			this.select[2] = box;
			box.inputEnabled = false;
			//TODO if the objects are the last too but they have random original images.. then let the user win since there might be a bug
			if (this.select[1].original == this.select[2].original && this.select[1].location != this.select[2].location) {
	
				card1= this.add.tween(this.select[1]).to({alpha:[0,1,0]}, 1500, Phaser.Easing.Bounce .InOut, true,800);//onComplete.add(this.enableShape,this,'',1);
				card2= this.add.tween(this.select[2]).to({ alpha:[0,1,0]}, 1500, Phaser.Easing.Bounce .InOut, true,800);//.onComplete.add(this.enableShape,this,'',2);
				
				//TODO move them together, create a "small explosion effect" and add it to the score (tween to score)
				//or just make them small :)
			if (0) {
				//TODO test with 2 cards
				this.add.tween(card1,card2).to({ alpha: 1 }, 250, "Linear", true, this._i * 250);
				this.add.tween(star).to({ x: 32  }, 750, "Sine.easeIn", true, (this._i * 250) + 250);
				var tween = this.add.tween(star).to({ y: 32 }, 750, "Sine.easeOut", true, (this._i * 250) + 250);

		}

			//	var alphaOut = function (tw)
				//card1.to({alpha:0}, 500, Phaser.Easing.Bounce .InOut, true,2000);
			//	card2.to({alpha:0}, 500, Phaser.Easing.Bounce .InOut, true,2000);
				this.totalMatches--;
				this.score+=1;
				this.txtScore.render.call(this);
				if (this.totalMatches <= 0) {
					this.time.events.add(2000, this.youWon,this);
		
				}
				this.canClick=1;
			} else {
				
				for (i = 1; i <= 2; i++)
				{
						t1= this.add.tween(this.select[i].scale).to({ x:0,y:1}, 300, Phaser.Easing.Sinusoidal.InOut, false,1500);

						t1.onComplete.add(function(tween,object, i) {
					//	console.log('nr' +tweenOptions + ' '+ obj.original + ' ' +i);
							this.select[i].frameName = 'hiddenBox';
			
						}			,this,'',i)

					
						t2=this.add.tween(this.select[i].scale).to({ x:1,y:1}, 500, Phaser.Easing.Sinusoidal.InOut, false);
						t2.onComplete.add(this.enableShape,this,'',i);
						t1.chain(t2);
						t1.start();
					}
				}
				

		
		//	console.log("c" + this.currentMove + ' ' + this.totalMoves);

			this.toggle=true;
		}
		this.txtMoves.render.call(this);
	},
	enableShape:function(a,b,shape) {
	//	console.log('enable' +a + ' '+ b + ' ' +shape);
		this.select[shape].inputEnabled=true;
		this.canClick=1;
	},

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
