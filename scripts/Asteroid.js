define(function(require) {
    var CanvasVector = require('CanvasVector');
    var modulo = require('utilities/modulo');
    var generateRandomPolygon = require('utilities/generateRandomPolygon');

    function Asteroid(center, momentum, size) {
        this.center = center;
        this.momentum = momentum;
        this.size = size;
        this.valid = true;

        if (this.size == 3) {
            this.points = generateRandomPolygon(30, 50, 20, 25, 50);
        } else if (this.size == 2) {
            this.points = generateRandomPolygon(10, 30, 15, 25, 50);
        } else if (this.size == 1) {
            this.points = generateRandomPolygon(5, 10, 10, 25, 50);
        }
    }

    Asteroid.COLOR = '#FFF';

    Asteroid.prototype.createSmallerAsteroid = function() {
        return new Asteroid(
            { x: this.center.x + Math.getRandomInt(-25, 25), y: this.center.y + Math.getRandomInt(-25, 25) },
            new CanvasVector(.5, Math.random() * 2 * Math.PI),
            this.size - 1
        );
    };

    Asteroid.prototype.draw = function(screen, gameSize) {
        this.drawAsteroid(screen, gameSize)
            .drawGhosts(screen, gameSize);
    };

    Asteroid.prototype.drawAsteroid = function(screen, gameSize) {
        var vertices = this.getVertices();
        var first    = vertices.shift();

        screen.beginPath();
        screen.strokeStyle = Asteroid.COLOR;
        screen.moveTo(first.x, first.y);
        vertices.forEach(function(vertex) {
            screen.lineTo(vertex.x, vertex.y);
        });
        screen.closePath();
        screen.stroke();

        return this;
    };

    Asteroid.prototype.drawGhosts = function(screen, gameSize) {
        var vertices = this.getVertices();
        var first    = vertices.shift();

        for (var i = 0; i < 8; ++i) {
            var x = modulo(i - 6, 3) - 1;
            var y = Math.floor(i / 3) - 1;

            screen.beginPath();
            screen.strokeStyle = Asteroid.COLOR;
            screen.moveTo(first.x + (x * gameSize.x), first.y + (y * gameSize.y));
            vertices.forEach(function(vertex) {
                screen.lineTo(vertex.x + (x * gameSize.x), vertex.y + y * gameSize.y);
            });
            screen.closePath();
            screen.stroke();
        }

        return this;
    };

    Asteroid.prototype.getVertices = function() {
        return this.points.map(function(point) {
            return { x: point.x + this.x, y: point.y + this.y };
        }.bind(this.center));
    };

    Asteroid.prototype.isValid = function() {
        return this.valid;
    };

    Asteroid.prototype.remove = function() {
        this.valid = false;

        return this;
    };

    Asteroid.prototype.update = function(gameSize) {
        this.center.x = modulo(this.center.x + this.momentum.getX(), gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), gameSize.y);
    };

    return Asteroid;
});
