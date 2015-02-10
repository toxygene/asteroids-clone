define(function(require) {
    var Asteroid = require('Asteroid');
    var CanvasVector = require('CanvasVector');
    var Player = require('Player');

	var Asteroids = function(canvasId) {
		this.asteroid = new Asteroid({ x: 200, y: 200 }, new CanvasVector(.5, Math.random() * Math.PI));
		this.canvas = document.getElementById(canvasId);
		this.gameSize = { x: this.canvas.width, y: this.canvas.height };
		this.player = new Player(this, this.gameSize);
		this.screen = this.canvas.getContext('2d');

		this.onTickHandler = this.onTickHandler.bind(this);

		this.onTickHandler();
	};
	
	Asteroids.prototype.draw = function(screen, gameSize) {
		screen.save();
		screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y);
		screen.fillStyle = "#000000";
		screen.fillRect(0, 0, this.gameSize.x, this.gameSize.y);
		screen.restore();

		this.player.draw(screen, gameSize);
		this.asteroid.draw(screen, gameSize);

		return this;
	};
	
	Asteroids.prototype.onTickHandler = function() {
		this.update()
			.draw(this.screen, this.gameSize);

		requestAnimationFrame(this.onTickHandler);
	};
	
	Asteroids.prototype.update = function() {
		this.player.update();
		this.asteroid.update();
		
		return this;
	};
	
	return Asteroids;
});
