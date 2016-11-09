"use strict";

import Asteroid from './Asteroid';
import Bullet from './Bullet';
import CanvasVector from './CanvasVector';
import Disintegration from './Disintegration';
import getRandomInt from './utilities/getRandomInt';
import inside from './utilities/inside';
import Keyboard from './Keyboard';
import modulo from './utilities/modulo';
import PlayerShip from './PlayerShip';
import SSCD from 'sscd';

export default class {
	constructor() {
	    this.fireBulletCooldown = 0;
	    this.bulletCooldownAmount = 350;
        this.keyboard = new Keyboard();
        this.objects = null;
        this.playerShip = null;
	};

	draw(context, gameSize) {
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, gameSize.x, gameSize.Y);

		context.fillStyle = "#000000";
		context.fillRect(0, 0, gameSize.x, gameSize.y);

        this.objects.forEach(function(object) {
            object.draw(context, gameSize);
        });

		return this;
	};

	update(gameSize, elapsedTime) {
	    // Setup the initial level state
        if (this.objects === null) {
            this.playerShip = new PlayerShip({ x: gameSize.x / 2, y: gameSize.y / 2 });

            this.objects = [ this.playerShip ];

            // Create asteroid(s)
            for (var i = 0, n = getRandomInt(3, 5); i < n; ++i) {
                this.objects.push(
                    new Asteroid(
                        { x: getRandomInt(0, gameSize.x), y: getRandomInt(0, gameSize.y) },
                        new CanvasVector(.5, Math.random() * 2 * Math.PI),
                        3
                    )
                );
            }
        }
        
        if (this.playerShip.isValid()) {
            if (this.keyboard.isDown(this.keyboard.keys.left)) {
                this.playerShip.turnLeft(elapsedTime / 1000);
            }

            if (this.keyboard.isDown(this.keyboard.keys.right)) {
                this.playerShip.turnRight(elapsedTime / 1000);
            }

            if (this.keyboard.isDown(this.keyboard.keys.up)) {
                this.playerShip.accelerate(elapsedTime / 1000);
            }

            if (this.keyboard.isDown(this.keyboard.keys.space) && this.fireBulletCooldown == 0) {
                this.objects.push(new Bullet(this.playerShip.center, new CanvasVector(2, -this.playerShip.angle), this.gameSize));
                this.fireBulletCooldown = this.bulletCooldownAmount;
            }
            
            this.fireBulletCooldown = Math.max(0, this.fireBulletCooldown - elapsedTime);
        }

        // Update all the objects
	    this.objects.forEach(function(object) {
	        object.update(gameSize, elapsedTime);
	    });

        // Split the objects into types and check for collisions
	    var playerShips = this.objects.filter(obj => obj instanceof PlayerShip);
        var asteroids = this.objects.filter(obj => obj instanceof Asteroid);
        var bullets = this.objects.filter(obj => obj instanceof Bullet);
        
        var world = new SSCD.sscd.World();
        // todo implement collission detection

       
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
            }
        }.bind(this));

        
	    this.objects = this.objects.filter(function(object) {
	        return object.isValid();
        });

		return this;
	};
}
