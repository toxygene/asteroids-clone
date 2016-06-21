define(function(require) {
    var Asteroid     = require('Asteroid');
    var CanvasVector = require('CanvasVector');
    var inside       = require('utilities/inside');
    var PlayerShip   = require('PlayerShip');

	var Level = function() {
        this.objects = [
            new PlayerShip(),
            new Asteroid({ x: 200, y: 200 }, new CanvasVector(.5, Math.random() * Math.PI))
        ];
	};

	Level.prototype.draw = function(screen, gameSize) {
		screen.save();
		screen.clearRect(0, 0, gameSize.x, gameSize.y);
		screen.fillStyle = "#000000";
		screen.fillRect(0, 0, gameSize.x, gameSize.y);
		screen.restore();

        this.objects.forEach(function(object) {
            object.draw(screen, gameSize);
        });

		return this;
	};

	Level.prototype.update = function(gameSize) {
	    this.objects.forEach(function(object) {
	        object.update(gameSize);
	    });

        // check for collisions?
/*
        var playerPoints = this.player.getVertices();
        var asteroidPoints = this.asteroid.getVerticies();

        var collision = playerPoints.some(function(point) {
            return inside(point, asteroidPoints);
        });
*/

		return this;
	};

	return Level;
});
