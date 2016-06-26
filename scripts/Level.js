define(function(require) {
    var Asteroid       = require('Asteroid');
    var Bullet         = require('Bullet');
    var CanvasVector   = require('CanvasVector');
    var Disintegration = require('Disintegration');
    var inside         = require('utilities/inside');
    var PlayerShip     = require('PlayerShip');

	var Level = function() {
        this.objects = null;
	};

	Level.prototype.draw = function(context, gameSize) {
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, gameSize.x, gameSize.Y);

		context.fillStyle = "#000000";
		context.fillRect(0, 0, gameSize.x, gameSize.y);

        this.objects.forEach(function(object) {
            object.draw(context, gameSize);
        });

		return this;
	};

	Level.prototype.update = function(gameSize) {
	    // Setup the initial level state
        if (this.objects === null) {
            // Create the players ship
            this.objects = [
                new PlayerShip({ x: gameSize.x / 2, y: gameSize.y / 2 }, function(bullet) { this.objects.push(bullet); }.bind(this))
            ];

            // Create asteroid(s)
            for (var i = 0, n = Math.getRandomInt(2, 4); i < n; ++i) {
                this.objects.push(
                    new Asteroid(
                        { x: Math.getRandomInt(0, gameSize.x), y: Math.getRandomInt(0, gameSize.y) },
                        new CanvasVector(.5, Math.random() * 2 * Math.PI),
                        3
                    )
                );
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

            var asteroid = asteroids.filter(function(asteroid) {
                return asteroid.isValid();
            }).find(function(asteroid) {
                var asteroidPoints = asteroid.getVertices();

                return playerShipPoints.some(function(playerShipPoint) {
                    return inside(playerShipPoint, asteroidPoints);
                });
            });

            if (asteroid) {
                this.objects.push(new Disintegration(playerShip.getVertices(), asteroid.momentum.add(playerShip.momentum)));

                playerShip.remove();
                asteroid.remove();

                if (asteroid.size != 1) {
                    this.objects.push(asteroid.createSmallerAsteroid());
                    this.objects.push(asteroid.createSmallerAsteroid());
                }
            }
        }.bind(this));

        asteroids.forEach(function(asteroid) {
            var asteroidPoints = asteroid.getVertices();

            var bullet = bullets.filter(function(bullet) {
                return bullet.isValid();
            }).find(function(bullet) {
                return inside(bullet.getVertex(), asteroidPoints);
            });

            if (bullet) {
                bullet.remove();
                asteroid.remove();

                if (asteroid.size != 1) {
                    this.objects.push(asteroid.createSmallerAsteroid());
                    this.objects.push(asteroid.createSmallerAsteroid());
                }
                debugger;
            }
        }.bind(this));

	    this.objects = this.objects.filter(function(object) {
	        return object.isValid();
        });

		return this;
	};

	return Level;
});
