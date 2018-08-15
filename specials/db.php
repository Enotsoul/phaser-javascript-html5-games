<?php

$dbFilename = "eb772fddba4dab2214bd79da4aed214cdee8b795.sqlite";

    //open the database
$db = new PDO("sqlite:{$dbFilename}");
//TODO verify if db is not null..etc
function createDataBase() {
	global $db, $dbFilename;
	if (filesize($dbFilename) <= 1) {
		//TODO game...
		$db->exec("CREATE TABLE highscore (id INTEGER PRIMARY KEY, username TEXT, highscore INT)");   
	}
}
createDataBase();
//TODO
/// AUTH
/// REGISTER

function addHighscore ($username,$score) {
	global $db;
	$sth = $db->prepare('INSERT INTO highscore (username,highscore) VALUES (:user,:highscore)');
	$sth->bindParam(':user', $username);
	$sth->bindParam(':highscore', $score);
	$sth->execute();
	return 1;
}
function getHighscores () {
	global $db;
	$query = $db->query('SELECT * FROM highscore ORDER BY highscore DESC');
	foreach ($query as $row) {
		$result[] = $row;
	}
	return $result;
}
/*
 if ($_GET['cmd'] == "viewflags") {
    //now output the data to a simple html table...
    print "<table border=1>";
    print "<tr><td>id</td><td>User</td><td>Password</td></tr>";
    $result = $db->query('SELECT * FROM flags');
    foreach($result as $row)
    {
      print "<tr><td>".$row['id']."</td>";
      print "<td>".$row['user']."</td>";
      print "<td>".$row['password']."</td></tr>";
    }
    print "</table><br> Hope you are happy!";
} */
// $db = NULL;
 
