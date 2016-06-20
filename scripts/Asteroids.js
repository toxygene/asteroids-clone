define(function(require) {
    var Asteroid = require('Asteroid');
    var CanvasVector = require('CanvasVector');
    var inside = require('utilities/inside');
    var rotate = require('utilities/rotate');
    var Player = require('Player');

	var Asteroids = function(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.gameSize = { x: this.canvas.width, y: this.canvas.height };
        this.asteroid = new Asteroid({ x: 200, y: 200 }, new CanvasVector(.5, Math.random() * Math.PI), this.gameSize);
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
			.draw(this.screen);

		requestAnimationFrame(this.onTickHandler);
	};

	Asteroids.prototype.update = function() {
		this.player.update();
		this.asteroid.update();

        var playerPoints = this.player.getVertices();
        var asteroidPoints = this.asteroid.getVerticies();

        var anyPointsInside = playerPoints.some(function(point) {
            return inside(point, asteroidPoints);
        });

        if (anyPointsInside) {
            console.log('collision');
        } else {
            console.log('ok');
        }

		return this;
	};

	return Asteroids;
});
