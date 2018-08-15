/*
 * 
 
 TODO levels
 * Get to a certain pointlevel
 * 32
 * 64
 * 128
 * 256
 * 512
 * 1024
 * 2048
 
 Various gameplay things
  Bomb (join 2 bombs to get a bomb)
 Zombie (you lose points where it adjoins anyother thing)
 
 You lose when the board is full..
 * Highscore online
 
 TODO easing and tweens bounce
 * TODO save last game .. click new game
 * view highscores.. post highscore
 */
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
    this.background;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.


   // tile width, in pixels
	this.tileSize = 100;
				
	// game array, starts with all cells to zero
	//TODO multidimensional array [0][0]
	this.fieldArray = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
	// this is the group which will contain all tile sprites
	this.tileSprites;
	// variables to handle keyboard input
	this.upKey;
	this.downKey;
	this.leftKey;
	this.rightKey;
	this.swipe;
	// colors to tint tiles according to their value
	this.colors = {
		2:0xFFFFFF,
		4:0xBDFFBE,
		8:0xD2E4B0,
		16:0xFFCCCC,
		32:0xFFBBBB,
		64:0xFFAAAA,
		128:0xFF9999,
		256:0xFF8888,
		512:0xFF7777,
		1024:0xFF6666,
		2048:0xFF5555,
		4096:0xFF4444,
		8192:0xFF3333,
		16384:0xFF2222,
		32768:0xFF1111,
		65536:0xFF0000
	}
	// at the beginning of the game, the player cannot move
	this.canMove=false;


};

BasicGame.Game.prototype = {
	
	init: function() {

		this.score = 0;
	},

    create: function () {
		this.background = this.add.sprite(0, 0, 'gamebackground');
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
		// listeners for WASD keys
		//TODO better way to do this..  anyway, swipe handles this:)
		/*
		upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		upKey.onDown.add(moveUp,this);
		downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		downKey.onDown.add(moveDown,this);
		leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		leftKey.onDown.add(moveLeft,this);
		rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		rightKey.onDown.add(moveRight,this);
		* */
			
		//Swipe generation
		this.swipe = new Swipe(this, this.moveSwipe);
		
		// sprite group declaration
		this.tileSprites = this.game.add.group();
		// at the beginning of the game we add two "2"
		this.addTwo();
		this.addTwo();
	
		this.scoreText = this.game.add.text(this.game.world.width/3, this.game.world.height/2, "Score: " + this.score, { font: "32px Arial", fill: "#ffffff", align: "center" });
		this.scoreText.anchor.x = 0.5;
    },
    updateScore: function () {
		 this.scoreText.text = "Score: " + this.score + "";
	},

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		direction = this.swipe.check();
		if (direction!==null) 
			this.moveSwipe(direction.direction);
	//	console.log("Can move "+ this.canMove);
    },
    //Swipe movement, note this handles up/down/left/right!
	moveSwipe: function(direction) {
		
		switch(direction) {
		   case this.swipe.DIRECTION_LEFT: // do something
				this.moveLeft(); 
		   case this.swipe.DIRECTION_RIGHT:
				this.moveRight();
		   case this.swipe.DIRECTION_UP:
				this.moveUp(); 
		   case this.swipe.DIRECTION_DOWN:
				this.moveDown();
		   case this.swipe.DIRECTION_UP_LEFT:
		   case this.swipe.DIRECTION_UP_RIGHT:
		   case this.swipe.DIRECTION_DOWN_LEFT:
		   case this.swipe.DIRECTION_DOWN_RIGHT:
		}
    /*
		  up = function(point) { console.log("MoveUp"); moveUp(); };
		  down= function(point) { moveDown(); };
		  left= function(point) { moveLeft(); };
		  right= function(point) { moveRight(); };
	  */

	},
    	// A NEW "2" IS ADDED TO THE GAME
    	//TODO if everything is full.. Game Over screen with retry button
    addTwo: function () {
		
		//TODO use a better function.. to fill in empt yfield.. maybe an array and chose random empty spots:)
		// choosing an empty tile in the field 
		do{
			var randomValue = Math.floor(Math.random()*16);
		} while (this.fieldArray[randomValue]!=0)
		// such empty tile now takes "2" value
		this.fieldArray[randomValue]=2;
		// creation of a new sprite with "tile" instance, that is "tile.png" we loaded before
		var tile = this.game.add.sprite(this.toCol(randomValue)*this.tileSize,this.toRow(randomValue)*this.tileSize,"tile");
		//tile.scale.setTo(2,2);
		// creation of a custom property "pos" and assigning it the index of the newly added "2"
		tile.pos = randomValue;
		// at the beginning the tile is completely transparent
		tile.alpha=0;
		// creation of a text which will represent the value of the tile
		var text = this.game.add.text(this.tileSize/2,this.tileSize/2,"2",{font:"bold 16px Arial",align:"center"});
			 // setting text anchor in the horizontal and vertical center
		text.anchor.set(0.5);
		// adding the text as a child of tile sprite
		tile.addChild(text);
		// adding tile sprites to the group
		this.tileSprites.add(tile);
		// creation of a new tween for the tile sprite
		var fadeIn = this.game.add.tween(tile);
		// the tween will make the sprite completely opaque in 250 milliseconds
		fadeIn.to({alpha:1},250);
		// tween callback
		//The this at the end is the CONTEXT
		fadeIn.onComplete.add(function(){
			// updating tile numbers. This is not necessary the 1st time, anyway
			this.updateNumbers();
			// now I can move
			this.canMove=true;
		},this)
		// starting the tween
		fadeIn.start();


	},
			
	// GIVING A NUMBER IN A 1-DIMENSION ARRAY, RETURNS THE ROW
	toRow:function(n){
		return Math.floor(n/4);
	},
	
	// GIVING A NUMBER IN A 1-DIMENSION ARRAY, RETURNS THE COLUMN
	 toCol: function(n){
		return n%4;	
	},

	// THIS FUNCTION UPDATES THE NUMBER AND COLOR IN EACH TILE
	updateNumbers: function(){
		// look how I loop through all tiles, note: "this" at the end is the context
		this.tileSprites.forEach(function(item){
			// retrieving the proper value to show
			var value = this.fieldArray[item.pos];
			// showing the value
			item.getChildAt(0).text=value;
			// tinting the tile
			item.tint=this.colors[value]
			/*
			var movement = this.game.add.tween(item);
			movement.to({},500,Phaser.Easing.Elastic.InOut,true );
			movement.start();*/
		},this);	
		this.updateScore();
	},
	
	// MOVING TILES LEFT
	moveLeft: function(){
		// Is the player allowed to move?
		 if(this.canMove){
			// the player can move, let's set "canMove" to false to prevent moving again until the move process is done
			this.canMove=false;
			// keeping track if the player moved, i.e. if it's a legal move
			var moved = false;
			// look how I can sort a group ordering it by a property
			this.tileSprites.sort("x",Phaser.Group.SORT_ASCENDING);
			// looping through each element in the group
			this.tileSprites.forEach(function(item){
				// getting row and column starting from a one-dimensional array
				var row = this.toRow(item.pos);
				var col = this.toCol(item.pos);
				// checking if we aren't already on the leftmost column (the tile can't move)
				if(col>0){
					// setting a "remove" flag to false. Sometimes you have to remove tiles, when two merge into one 
					var remove = false;
					// looping from column position back to the leftmost column
					for(i=col-1;i>=0;i--){
						// if we find a tile which is not empty, our search is about to end...
						if(this.fieldArray[row*4+i]!=0){
							// ...we just have to see if the tile we are landing on has the same value of the tile we are moving
							if(this.fieldArray[row*4+i]==this.fieldArray[row*4+col]){
								// in this case the current tile will be removed
								remove = true;
								i--;                                             
							}
							break;
						}
					}
					// if we can actually move...
					if(col!=i+1){
						// set moved to true
						 moved=true;
						 // moving the tile "item" from row*4+col to row*4+i+1 and (if allowed) remove it
						 this.moveTile(item,row*4+col,row*4+i+1,remove);
					}
				}
		},this);
		// completing the move
		this.endMove(moved);
		}
	},
	
	// FUNCTION TO COMPLETE THE MOVE AND PLACE ANOTHER "2" IF WE CAN
	 endMove: function(m){
		// if we move the tile...
		if(m){
			// add another "2"
			this.addTwo();
		 } else{
			// otherwise just let the player be able to move again
			this.canMove=true;
		}
	},
	
	// FUNCTION TO MOVE A TILE
	 moveTile: function(tile,from,to,remove){
		// first, we update the array with new values
		this. fieldArray[to]=this.fieldArray[from];
		this.fieldArray[from]=0;
		 tile.pos=to;
		 // then we create a tween
		 var movement = this.game.add.tween(tile);
		 //TODO make tween when 2 "collide" so it grows and decreases in size 
		 // probably the "to" tile
		 //Bounce.out
		 movement.to({x:this.tileSize*(this.toCol(to)),y:this.tileSize*(this.toRow(to))},500,Phaser.Easing.Back.Out,true );
		 if(remove){
			// if the tile has to be removed, it means the destination tile must be multiplied by 2
			  var addScore = this.fieldArray[to]*=2;
			  this.score += addScore;
			  // at the end of the tween we must destroy the tile
			  movement.onComplete.add(function(){
				   tile.destroy();
			  },this);
		 }
		 // let the tween begin!
		 movement.start();
	},
	
	// MOVING TILES UP - SAME PRINCIPLES AS BEFORE
	moveUp: function(){
		if(this.canMove){
			this.canMove=false;
			var moved=false;
			this.tileSprites.sort("y",Phaser.Group.SORT_ASCENDING);
			this.tileSprites.forEach(function(item){
				var row = this.toRow(item.pos);
				var col = this.toCol(item.pos);
				if(row>0){  
					var remove=false;
					for(i=row-1;i>=0;i--){
						if(this.fieldArray[i*4+col]!=0){
							if(this.fieldArray[i*4+col]==this.fieldArray[row*4+col]){
								remove = true;
								i--;                                             
							}
						  break
						}
					}
					if(row!=i+1){
						 moved=true;
						 this.moveTile(item,row*4+col,(i+1)*4+col,remove);
					}
				}
			},this);
			this.endMove(moved);
		}
	},

// MOVING TILES RIGHT - SAME PRINCIPLES AS BEFORE
	 moveRight: function(){
		  if(this.canMove){
			  this.canMove=false;
			  var moved=false;
			this.tileSprites.sort("x",Phaser.Group.SORT_DESCENDING);
			this.tileSprites.forEach(function(item){
				var row = this.toRow(item.pos);
				var col = this.toCol(item.pos);
				if(col<3){
					var remove = false;
					for(i=col+1;i<=3;i++){
						if(this.fieldArray[row*4+i]!=0){
							if(this.fieldArray[row*4+i]==this.fieldArray[row*4+col]){
								remove = true;
								i++;                                             
							}
							break
						}
					}
					if(col!=i-1){
								 moved=true;
						this.moveTile(item,row*4+col,row*4+i-1,remove);
					}
				}
			},this);
		this.endMove(moved);
	 }
	},
	
	// MOVING TILES DOWN - SAME PRINCIPLES AS BEFORE
	moveDown: function(){
		if(this.canMove){
			this.canMove=false;
			var moved=false;
			this.tileSprites.sort("y",Phaser.Group.SORT_DESCENDING);
			this.tileSprites.forEach(function(item){
				var row = this.toRow(item.pos);
				var col = this.toCol(item.pos);
				if(row<3){
							var remove = false;
					for(i=row+1;i<=3;i++){
						if(this.fieldArray[i*4+col]!=0){
							if(this.fieldArray[i*4+col]==this.fieldArray[row*4+col]){
								remove = true;
								i++;                                             
							}
									  break
						}
					}
					if(row!=i-1){
						moved=true;
						this.moveTile(item,row*4+col,(i-1)*4+col,remove);
					}
				}
			},this);
				this.endMove(moved);
		}
	},
    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
