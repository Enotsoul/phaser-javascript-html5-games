<?php
include 'db.php';
ini_set("allow_url_fopen", 1);
function respondAndQuit($message) {
	  echo  json_encode(['error'=> $message]);
	  die;
}

function respondJSON($array) {
	  echo  json_encode($array);
	  die;
}

//Make sure that it is a POST request.
if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
    respondAndQuit('Request method must be POST!');
}
 
//Make sure that the content type of the POST request has been set to application/json
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
if(strcasecmp($contentType, 'application/json') != 0){
    respondAndQuit('Content type must be: application/json');
}

//atlternative
//@json_decode(($stream = fopen('php://input', 'r')) !== false ? stream_get_contents($stream) : "{}");
 
//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));
 
//Attempt to decode the incoming RAW post data from JSON.
$decoded = json_decode($content, true);
 
//If json_decode failed, the JSON is invalid.
if(!is_array($decoded)){
    respondAndQuit("Received content contained invalid JSON!");
}
 
if (!isset($decoded['cmd'])) {
	respondAndQuit("Invalid command");
}

try {
	
switch ($decoded['cmd']) {
    case "addHighscore":
     	addHighscore($decoded['name'],$decoded['score']);
		print respondJSON(['success'=>'Successfully added highscore']);
        break;
    case "getHighscores":
		print respondJSON(getHighscores());
        break;
    case "cake":

        break;
    default:
		respondAndQuit("Unknown command");
}

//Process the JSON.
//echo json_encode(['message'=> "Success!  {$decoded['name']} with score {$decoded['score']} "]);

} catch(Error $e)
{
	print json_encode(['error'=>'Exception : '.$e->getMessage()]);
}


