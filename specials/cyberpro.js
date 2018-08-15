
var CyberPro = (function(){
	
	//Login/Auth
	//Register
	//GameInit (get unique key for signing)
	//Heartbeat (specific key for signing)
	//LocalStorage
//	var gameName = 'CyberProGame';
	
	this.gameName = 'undefinedCyberProGame'
	
		
	var highscore = {};
	highscore.currentScore =0;
	highscore.currentPlayingTime=0;
	highscore.bestScore=0;
	highscore.startTime=0;
	
	function init(newname) {
		gameName = newname;	
		this.getHighscore();
		highscore.startTime = Date.now()	
	}
	function getGameName () {
		return gameName;
	}
	//TODO callback function :)
	function post (url,dataSent) {
		fetch( url, 
		{
			method: 'POST',
			headers: {
					'Content-Type': 'application/json'
			},
			body: JSON.stringify(dataSent),
		}).then(function(response) {
			return response.json()
	  }).then(function(json) {
			console.log('Response', json);
	  }).catch(function(ex) {
			console.log('parsing failed ' + ex);
	  })
	}

	

	

//TODO save best time to database too:)
	
	function saveHighscore(score = 0) {
		//only do anything if it's a true highscore
		if (score ==0)
			score = highscore.currentScore;
		if (highscore.bestScore < score)  {
			localforage.setItem(gameName+ ".highscore",score);
			highscore.bestScore = score;
		}
		highscore.currentPlayingTime = Date.now()-highscore.startTime;
	};
	function getHighscore(runFunction = '') {
		localforage.getItem(gameName+ ".highscore").then(function(value) {		
			if (value === null) 
				value = 0;
			highscore.bestScore  = value;
			runFunction;
		}).catch(function(err) {
				console.log("Something nasty happened while getting the highscore " +err);
		});
	};
	
	return {
		init : init,
		post : post,
		gameName:getGameName,
		saveHighscore:saveHighscore,
		getHighscore:getHighscore,
		highscore:highscore,
	}
}());
//CyberPro.highscore = function () {};

//CyberPro.init('MyGame');
//CyberPro.saveHighscore(10);


/*
 * 
 * function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

b64EncodeUnicode('✓ à la mode'); // "4pyTIMOgIGxhIG1vZGU="
b64EncodeUnicode('\n'); // "Cg=="
* 
* function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

b64DecodeUnicode('4pyTIMOgIGxhIG1vZGU='); // "✓ à la mode"
b64DecodeUnicode('Cg=='); // "\n"
* */
