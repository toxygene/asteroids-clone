import Bullet from './Bullet';
import CanvasVector from './CanvasVector';
import Keyboard from './Keyboard';
import modulo from './utilities/modulo';
import rotate from './utilities/rotate';
import throttle from './utilities/throttle';

export default class PlayerShip {
    constructor(center, fireBullet) {
        this.color = '#FFF';
        this.maxBullets = 5;
        this.maxMagnatude = 3.5;
        this.minBulletThrottle = 250;
        this.shape = [
            { x: 10, y: 0 },
            { x: 0, y: 3 },
            { x: -10, y: 6 },
            { x: -10, y: -6 },
            { x: 0, y: -3 }
        ];
        
        this.angle = Math.PI/2;
        this.center = center;
        this.fireBullet = fireBullet;
        this.momentum = new CanvasVector(0, this.angle);
        this.keyboard = new Keyboard();
        this.bullets = [];
        this.valid = true;
        this.attemptToFireBullet = throttle(this.attemptToFireBullet.bind(this), this.minBulletThrottle); // refactor to use ticks instead of time

        setInterval(function() {
            this.momentum = this.momentum.addMagnatude(-.1).magnatudeRange(0, this.maxMagnatude);
        }.bind(this), 50); // refactor to use ticks instead of time
    };

    attemptToFireBullet() {
        if (this.bullets.length < this.maxBullets) {
            var bullet = new Bullet(this.center, new CanvasVector(2, -this.angle), this.gameSize);
            this.bullets.push(bullet);
            this.fireBullet(bullet);
            this.ticksSinceLastShot = 0;
        }

        return true;
    };

    draw(screen, gameSize) {
        this.drawShip(screen, gameSize)
            .drawGhostShips(screen, gameSize);
    };

    drawShip(screen, gameSize) {
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

    drawGhostShips(screen, gameSize) {
        for (var i = 0; i < 9; ++i) {
            var x = modulo(i, 3) - 1;
            var y = Math.floor(i / 3) - 1;

            if (x == 0 && y == 0) {
                continue;
            }

            screen.save();

            var vertices = this.getVertices();
            var first    = vertices.shift();

            screen.strokeStyle = this.color;
            screen.beginPath();
            screen.moveTo(first.x + (gameSize.x * x), first.y + (gameSize.y * y));
            vertices.forEach(function(vertex) {
                screen.lineTo(vertex.x + (gameSize.x * x), vertex.y + (gameSize.y * y));
            });
            screen.closePath();
            screen.stroke();

            screen.restore();
        }

        return this;
    };

    getVertices() {
        return rotate(this.shape, this.angle, { x: 0, y: 0}).map(function(point) {
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
        if (this.keyboard.isDown(this.keyboard.keys.left)) {
            this.angle += Math.PI/36;
        }

        if (this.keyboard.isDown(this.keyboard.keys.right)) {
            this.angle -= Math.PI/36;
        }

        this.angle = modulo(this.angle, 2 * Math.PI);

        if (this.keyboard.isDown(this.keyboard.keys.up)) {
            this.momentum = this.momentum.add(new CanvasVector(.15, -this.angle)).magnatudeRange(0, this.maxMagnatude);
        }

        if (this.keyboard.isDown(this.keyboard.keys.space)) {
            this.attemptToFireBullet();
        }

        this.center.x = modulo(this.center.x + this.momentum.getX(), gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), gameSize.y);

        this.bullets = this.bullets.filter(function(bullet) {
            return bullet.isValid();
        });
    };
};
