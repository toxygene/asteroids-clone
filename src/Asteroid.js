import CanvasVector from './CanvasVector';
import modulo from './utilities/modulo';
import generateRandomPolygon from './utilities/generateRandomPolygon';

export default class Asteroid {
    constructor(center, momentum, size) {
        this.color = '#FFF';

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

    createSmallerAsteroid() {
        return new Asteroid(
            { x: this.center.x + Math.getRandomInt(-25, 25), y: this.center.y + Math.getRandomInt(-25, 25) },
            new CanvasVector(.5, Math.random() * 2 * Math.PI),
            this.size - 1
        );
    };

    draw(screen, gameSize) {
        this.drawAsteroid(screen, gameSize)
            .drawGhosts(screen, gameSize);
    };

    drawAsteroid(screen, gameSize) {
        var vertices = this.getVertices();
        var first    = vertices.shift();

        screen.beginPath();
        screen.strokeStyle = this.color;
        screen.moveTo(first.x, first.y);
        vertices.forEach(function(vertex) {
            screen.lineTo(vertex.x, vertex.y);
        });
        screen.closePath();
        screen.stroke();

        return this;
    };

    drawGhosts(screen, gameSize) {
        var vertices = this.getVertices();
        var first    = vertices.shift();

        for (var i = 0; i < 8; ++i) {
            var x = modulo(i - 6, 3) - 1;
            var y = Math.floor(i / 3) - 1;

            screen.beginPath();
            screen.strokeStyle = this.color;
            screen.moveTo(first.x + (x * gameSize.x), first.y + (y * gameSize.y));
            vertices.forEach(function(vertex) {
                screen.lineTo(vertex.x + (x * gameSize.x), vertex.y + y * gameSize.y);
            });
            screen.closePath();
            screen.stroke();
        }

        return this;
    };

    getVertices() {
        return this.points.map(function(point) {
            return { x: point.x + this.x, y: point.y + this.y };
        }.bind(this.center));
    };

    isValid() {
        return this.valid;
    };

    remove() {
        this.valid = false;

        return this;
    };

    update(gameSize) {
        this.center.x = modulo(this.center.x + this.momentum.getX(), gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), gameSize.y);
    };
}
