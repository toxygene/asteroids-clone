define(function(require) {
    var modulo = require('utilities/modulo');

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
        for (var i = 0; i < vertices; ++i) {
            angleSteps[i] = angleSteps[i] / k;
        }

        var points = [];
        var angle = Math.random(0, 2 * Math.PI);

        for (var i = 0; i < vertices; ++i) {
            var r_i = Math.max(0, Math.min(Math.randomGaussian(40, 20), 80));
            var x = r_i * Math.cos(angle);
            var y = r_i * Math.sin(angle);

            points.push({ x: parseInt(x), y: parseInt(y) });

            angle += angleSteps[i];
        }

        return points;
    };

    function Asteroid(center, momentum) {
        this.center = center;
        this.momentum = momentum;

        this.points = generateRandomPolygon(Math.getRandomInt(5, 8))
    };

    Asteroid.prototype.update = function() {
        this.center.x += this.momentum.getX();
        this.center.y += this.momentum.getY();
    };

    Asteroid.prototype.draw = function(screen, gameSize) {
        this.drawAsteroid(screen, gameSize)
            .drawGhosts(screen, gameSize);
    };

    Asteroid.prototype.drawAsteroid = function(screen, gameSize) {
        screen.save();

        screen.strokeStyle = "#FFFFFF";
        screen.translate(modulo(this.center.x, gameSize.x), modulo(this.center.y, gameSize.y));
        screen.moveTo(this.points[0].x, this.points[0].y);

        screen.beginPath();
        this.points.slice(1).forEach(function(point) {
            screen.lineTo(point.x, point.y);
        });
        screen.closePath();

        screen.stroke();

        screen.restore();

        return this;
    };

    Asteroid.prototype.drawGhosts = function(screen, gameSize) {
        screen.save();

        // left
        screen.strokeStyle = "#FFFFFF";
        screen.translate(modulo(this.center.x, gameSize.x) - gameSize.x, modulo(this.center.y, gameSize.y));
        screen.moveTo(this.points[0].x, this.points[0].y);
        screen.beginPath();
        this.points.slice(1).forEach(function(point) {
            screen.lineTo(point.x, point.y);
        });
        screen.closePath();
        screen.stroke();

        screen.restore();
        screen.save();

        // top
        screen.strokeStyle = "#FFFFFF";
        screen.translate(modulo(this.center.x, gameSize.x), modulo(this.center.y, gameSize.y) - gameSize.y);
        screen.moveTo(this.points[0].x, this.points[0].y);
        screen.beginPath();
        this.points.slice(1).forEach(function(point) {
            screen.lineTo(point.x, point.y);
        });
        screen.closePath();
        screen.stroke();

        screen.restore();
        screen.save();

        // right
        screen.strokeStyle = "#FFFFFF";
        screen.translate(modulo(this.center.x, gameSize.x) + gameSize.x, modulo(this.center.y, gameSize.y));
        screen.moveTo(this.points[0].x, this.points[0].y);
        screen.beginPath();
        this.points.slice(1).forEach(function(point) {
            screen.lineTo(point.x, point.y);
        });
        screen.closePath();
        screen.stroke();

        screen.restore();
        screen.save();

        // bottom
        screen.strokeStyle = "#FFFFFF";
        screen.translate(modulo(this.center.x, gameSize.x), modulo(this.center.y, gameSize.y) + gameSize.y);
        screen.moveTo(this.points[0].x, this.points[0].y);
        screen.beginPath();
        this.points.slice(1).forEach(function(point) {
            screen.lineTo(point.x, point.y);
        });
        screen.closePath();
        screen.stroke();
        screen.restore();

        return this;
    };

    return Asteroid;
});
