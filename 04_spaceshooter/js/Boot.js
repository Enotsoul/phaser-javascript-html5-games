var SpaceDestiny = {};

SpaceDestiny.Boot = function (game) {

};

SpaceDestiny.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

 var clientWidth = function () {  return Math.max(window.innerWidth, document.documentElement.clientWidth);};
 var clientHeight = function () {  return Math.max(window.innerHeight, document.documentElement.clientHeight);};
        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
			this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        //    this.scale.pageAlignHorizontally = true;
			//this.scale.pageAlignVertically = true;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
        //   this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
         //  	this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
       //  	this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
          // 	this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
          
         // 		this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
		this.scale.scaleMode = Phaser.ScaleManager.RESIZE;



      //     this.scale.setMinMax(320,480, 768, 1024);
           this.scale.setMinMax(320,480, 320, 480);
		//		this.scale.setUserScale(clientWidth(),clientHeight());
         //   this.scale.forceLandscape = true;
            this.scale.forceOrientation(true,false);
         //   this.scale.pageAlignHorizontally = true;
          // this.scale.pageAlignVertically = true;

		this.scale.refresh();

 
			if (this.scale.isFullScreen)
			{
				this.scale.stopFullScreen();
			}
			else
			{
				this.scale.startFullScreen(false);
			}
	
        }
    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/sample.png');
        this.load.image('preloaderBar', 'assets/progressbar_green.png');

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('Preloader');

    }

};
