define(function(require) {
    var Asteroid     = require('Asteroid');
    var Bullet       = require('Bullet');
    var CanvasVector = require('CanvasVector');
    var inside       = require('utilities/inside');
    var PlayerShip   = require('PlayerShip');

	var Level = function() {
        this.objects = null;
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
	    // Setup the initial level state
        if (this.objects === null) {
            this.objects = [
                new PlayerShip({ x: gameSize.x / 2, y: gameSize.y / 2 })
            ];

            for (var i = 0, n = Math.getRandomInt(1, 3); i < n; ++i) {
                this.objects.push(new Asteroid({ x: Math.getRandomInt(0, gameSize.x), y: Math.getRandomInt(0, gameSize.y) }, new CanvasVector(.5, Math.random() * Math.PI)));
            }
        }

        // Update all the objects
	    this.objects.forEach(function(object) {
	        object.update(gameSize);
	    });

        // Split the objects into types and check for collisions
	    var playerShips = this.objects.filter(function(object) {
            return object instanceof PlayerShip;
        });

        var asteroids = this.objects.filter(function(object) {
            return object instanceof Asteroid;
        });

        var bullets = this.objects.filter(function(object) {
            return object instanceof Bullet;
        });

        playerShips.forEach(function(playerShip) {
            var playerShipPoints = playerShip.getVertices();

            var collision = asteroids.find(function(asteroid) {
                var asteroidPoints = asteroid.getVertices();

                return playerShipPoints.some(function(playerShipPoint) {
                    return inside(playerShipPoint, asteroidPoints);
                });
            });

            if (collision) {
                // destroy ship, split/destroy asteroid
            }
        });

        // TODO move bullet adding code to here (out of PlayerShip)
        asteroids.forEach(function(asteroid) {
            var asteroidPoints = asteroid.getVertices();

            var collision = bullets.filter(function(bullet) {
                return bullet.isValid();
            }).find(function(bullet) {
                return inside(bullet.getVertex(), asteroidPoints);
            });

            if (collision) {
                bullet.remove();
                asteroid.remove();

                // split asteroid?
            }
        });

	    this.objects = this.objects.filter(function(object) {
	        return object.isValid();
        });

		return this;
	};

	return Level;
});
