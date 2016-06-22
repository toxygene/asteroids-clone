define(function(require) {
    var Bullet = require('Bullet');
    var CanvasVector = require('CanvasVector');
    var Keyboard = require('Keyboard');
    var modulo = require('utilities/modulo');
    var rotate = require('utilities/rotate');
    var throttle = require('utilities/throttle');

    var PlayerShip = function(center) {
        this.angle = -Math.PI/2;
        this.center = center;
        this.momentum = new CanvasVector(0, this.angle);
        this.keyboard = new Keyboard();
        this.bullets = [];
        this.valid = true;
        this.attemptToFireBullet = throttle(this.attemptToFireBullet.bind(this), PlayerShip.MIN_BULLET_THROTTLE);

        setInterval(function() {
            this.momentum = this.momentum.addMagnatude(-.1).magnatudeRange(0, PlayerShip.MAX_MAGNATUDE);
        }.bind(this), 50);
    };

    PlayerShip.MIN_BULLET_THROTTLE = 250;
    PlayerShip.MAX_BULLETS         = 5;
    PlayerShip.MAX_MAGNATUDE       = 3.5;
    PlayerShip.COLOR               = '#FFF';

    PlayerShip.prototype.draw = function(screen, gameSize) {
        this.drawShip(screen, gameSize)
            .drawGhostShips(screen, gameSize)
            .drawBullets(screen, gameSize);
    };

    PlayerShip.prototype.drawShip = function(screen, gameSize) {
        screen.save();

        screen.translate(this.center.x, this.center.y);
        screen.rotate(this.angle);
        screen.strokeStyle = PlayerShip.COLOR;

        screen.beginPath();
        screen.moveTo(10, 0);
        screen.lineTo(-10, 6);
        screen.lineTo(-10, -6);
        screen.closePath();

        screen.stroke();

        screen.restore();

        return this;
    };

    PlayerShip.prototype.drawGhostShips = function(screen, gameSize) {
        for (var i = 0; i < 9; ++i) {
            var x = modulo(i, 3) - 1;
            var y = Math.floor(i / 3) - 1;

            if (x == 0 && y == 0) {
                continue;
            }

            screen.save();
            screen.strokeStyle = PlayerShip.COLOR;
            screen.translate(this.center.x - (x * gameSize.x), this.center.y - (y * gameSize.y));
            screen.rotate(this.angle);
            screen.beginPath();
            screen.moveTo(10, 0);
            screen.lineTo(-10, 6);
            screen.lineTo(-10, -6);
            screen.closePath();
            screen.stroke();
            screen.restore();
        }

        return this;
    };

    PlayerShip.prototype.drawBullets = function(screen, gameSize) {
        this.bullets.forEach(function(bullet) {
            bullet.draw(screen, gameSize);
        });
    };

    PlayerShip.prototype.getVertices = function() {
        return rotate([[10, 0], [-10, 6], [-10, -6]], this.momentum.getAngle()).map(function(point) {
            return [point[0] + this.x, point[1] + this.y]
        }.bind(this.center));
    };

    PlayerShip.prototype.isValid = function() {
        return this.valid;
    };

    PlayerShip.prototype.update = function(gameSize) {
        if (this.keyboard.isDown(this.keyboard.KEYS.LEFT)) {
            this.angle -= Math.PI/36;
        }

        if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT)) {
            this.angle += Math.PI/36;
        }

        if (this.keyboard.isDown(this.keyboard.KEYS.UP)) {
            this.momentum = this.momentum.add(new CanvasVector(.15, this.angle)).magnatudeRange(0, PlayerShip.MAX_MAGNATUDE);
        }

        if (this.keyboard.isDown(this.keyboard.KEYS.SPACE)) {
            this.attemptToFireBullet();
        }

        this.center.x = modulo(this.center.x + this.momentum.getX(), gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), gameSize.y);

        this.bullets = this.bullets.filter(function(bullet) {
            return bullet.isValid();
        });

        this.bullets.forEach(function(bullet) {
            bullet.update(gameSize);
        });
    };

    PlayerShip.prototype.attemptToFireBullet = function() {
        if (this.bullets.length < PlayerShip.MAX_BULLETS) {
            this.bullets.push(new Bullet(this.center, new CanvasVector(this.momentum.getMagnatude(), this.angle), this.gameSize));
        }

        return true;
    };

    return PlayerShip;
});
