# Phaser Games

**NOTE: I'm not planning on updating these anymore, use at your own discretion.**


These are some games I've developed while learning Phaser in 2017.
Phaser is a JavaScript 2D Game Library which you can use to build awesome Games with HTML5.
The only downside is that games with JavaScript and HTML5 use a lot of resources. You'll never be able to replicate real 3D games since JS is a performance hog.
Yet there are many cool 3d games out there in JavaScript/HTML5 which makes it a opportunity to do certain things.

Phaser eventually led me to Phoenix which led me to the Elixir. 
All of this happened while I was searching for a backend system which could be fault tolerant and could provide a high level of concurrenty.
After I've finished a few projects for some clients I've eventually decided to give up on building games with Phaser and pursued Elixir instead.
I've kept programming in Elixir since then. 

The /specials/ Folder contains a JavaScript and PHP API to save highscores using localforage and to save them to a SQLITE backend.


* 01_2048 - A 2048 clone. - had ideas to extend it and add multiplayer.
* 02_benjamin_hop - Initial setup for endless runner game
* 03_chubby_birds  - Flappy Bird Clone - HighScore system via JSON with PHP and Sqlite
* 04_spaceshooter  - A fully working space shooter with upgrades and stuff, I wanted to add a multiplayer version. TIme was precious so only single player available
* 05_matching - Match 2 sort of game testing a few things out 
* 06_tanks - A tanks game I wanted to extend to multiplayer with Phoenix + Elixir. Spent my time learning the Elixir internals instead:)


## To play the games you need a webserver running

To install a webserver try any of the following while in the main folder.
python -m SimpleHTTPServer 8000
php -S localhost:8000
sudo npm install http-server -g
http-server


## Copyright and License
Copyright [Clinciu Andrei](https://andreiclinciu.net) 
Licensed under [GPL 3.0](https://choosealicense.com/licenses/gpl-3.0/)

