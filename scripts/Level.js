define(function(require) {
    var Asteroid     = require('Asteroid');
    var CanvasVector = require('CanvasVector');
    var inside       = require('utilities/inside');
    var rotate       = require('utilities/rotate');
    var PlayerShip   = require('PlayerShip');

	var Level = function(canvas) {
		this.canvas   = canvas;
		this.gameSize = { x: this.canvas.width, y: this.canvas.height };
        this.asteroid = new Asteroid({ x: 200, y: 200 }, new CanvasVector(.5, Math.random() * Math.PI), this.gameSize);
		this.player   = new PlayerShip(this, this.gameSize);
		this.screen   = this.canvas.getContext('2d');

		this.onTickHandler = this.onTickHandler.bind(this);

		this.onTickHandler();
	};

	Level.prototype.draw = function(screen, gameSize) {
		screen.save();
		screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y);
		screen.fillStyle = "#000000";
		screen.fillRect(0, 0, this.gameSize.x, this.gameSize.y);
		screen.restore();

		this.player.draw(screen, gameSize);
		this.asteroid.draw(screen, gameSize);

		return this;
	};

	Level.prototype.onTickHandler = function() {
		this.update()
			.draw(this.screen);

		requestAnimationFrame(this.onTickHandler);
	};

	Level.prototype.update = function() {
		this.player.update();
		this.asteroid.update();

        var playerPoints = this.player.getVertices();
        var asteroidPoints = this.asteroid.getVerticies();

        var collision = playerPoints.some(function(point) {
            return inside(point, asteroidPoints);
        });

		return this;
	};

	return Level;
});
