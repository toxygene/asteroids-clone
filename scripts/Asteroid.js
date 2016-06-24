define(function(require) {
    var modulo = require('utilities/modulo');
    var generateRandomPolygon = require('utilities/generateRandomPolygon');

    function Asteroid(center, momentum) {
        this.center = center;
        this.momentum = momentum;
        this.valid = true;

        this.points = generateRandomPolygon(Math.getRandomInt(5, 8));
    }

    Asteroid.COLOR = '#FFF';

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
            screen.strokeStyle = "#FFFFFF";
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
