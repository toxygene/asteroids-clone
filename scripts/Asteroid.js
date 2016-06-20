define(function(require) {
    var modulo = require('utilities/modulo');
    var rotate = require('utilities/rotate');

    function generateRandomPolygon(vertices) {
        var angleSteps = [];
        var numberAngles = 2 * Math.PI / vertices;
        var sum = 0;

        for (var i = 0; i < vertices; ++i) {
            var tmp = numberAngles;
            angleSteps.push(tmp);
            sum += tmp;
        }

        var k = sum / (2 * Math.PI);
        for (i = 0; i < vertices; ++i) {
            angleSteps[i] = angleSteps[i] / k;
        }

        var points = [];
        var angle = Math.random(0, 2 * Math.PI);

        for (i = 0; i < vertices; ++i) {
            var r_i = Math.max(0, Math.min(Math.randomGaussian(40, 20), 80));
            var x = r_i * Math.cos(angle);
            var y = r_i * Math.sin(angle);

            points.push([parseInt(x), parseInt(y)]);

            angle += angleSteps[i];
        }

        return points;
    };

    function Asteroid(center, momentum, gameSize) {
        this.center = center;
        this.momentum = momentum;
        this.gameSize = gameSize;

        this.points = generateRandomPolygon(Math.getRandomInt(5, 8))
    }

    Asteroid.prototype.draw = function(screen) {
        this.drawAsteroid(screen)
            .drawGhosts(screen);
    };

    Asteroid.prototype.drawAsteroid = function(screen) {
        screen.save();

        screen.strokeStyle = "#FFFFFF";
        screen.translate(this.center.x, this.center.y);
        screen.moveTo(this.points[0][0], this.points[0][1]);

        screen.beginPath();
        this.points.slice(1).forEach(function(point) {
            screen.lineTo(point[0], point[1]);
        });
        screen.closePath();

        screen.stroke();

        screen.restore();

        return this;
    };

    Asteroid.prototype.drawGhosts = function(screen) {
        for (var i = 0; i < 9; ++i) {
            var x = modulo(i, 3) - 1;
            var y = Math.floor(i / 3) - 1;

            if (x == 0 && y == 0) {
                continue;
            }

            screen.save();
            screen.strokeStyle = "#FFFFFF";
            screen.translate(this.center.x - (x * this.gameSize.x), this.center.y - (y * this.gameSize.y));
            screen.moveTo(this.points[0][0], this.points[0][1]);
            screen.beginPath();
            this.points.slice(1).forEach(function(point) {
                screen.lineTo(point[0], point[1]);
            });
            screen.closePath();
            screen.stroke();
            screen.restore();
        }

        return this;
    };

    Asteroid.prototype.getVerticies = function() {
        return this.points.map(function(point) {
            return [point[0] + this.x, point[1] + this.y];
        }.bind(this.center));
    };

    Asteroid.prototype.update = function() {
        this.center.x = modulo(this.center.x + this.momentum.getX(), this.gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), this.gameSize.y);
    };

    return Asteroid;
});
