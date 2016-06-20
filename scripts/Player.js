define(function(require) {
    var Bullet = require('Bullet');
    var CanvasVector = require('CanvasVector');
    var Keyboard = require('Keyboard');
    var modulo = require('utilities/modulo');
    var rotate = require('utilities/rotate');
    var throttle = require('utilities/throttle');

    var Player = function(game, gameSize) {
        this.game = game;
        this.gameSize = gameSize;
        this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
        this.angle = -Math.PI/2;
        this.momentum = new CanvasVector(0, 0);
        this.keyboard = new Keyboard();
        this.bullets = [];
        this.attemptToFireBullet = throttle(this.attemptToFireBullet.bind(this), 250);

        setInterval(function() {
            this.momentum = this.momentum.addMagnatude(-.1).magnatudeRange(0, 3.5);
        }.bind(this), 50);
    };

    Player.prototype.draw = function(screen) {
        this.drawShip(screen)
            .drawGhostShips(screen)
            .drawBullets(screen);
    };

    Player.prototype.drawShip = function(screen) {
        screen.save();

        screen.translate(this.center.x, this.center.y);
        screen.rotate(this.angle);
        screen.strokeStyle = "#FFFFFF";

        screen.beginPath();
        screen.moveTo(10, 0);
        screen.lineTo(-10, 6);
        screen.lineTo(-10, -6);
        screen.closePath();

        screen.stroke();

        screen.restore();

        return this;
    };

    Player.prototype.drawGhostShips = function(screen) {
        for (var i = 0; i < 9; ++i) {
            var x = modulo(i, 3) - 1;
            var y = Math.floor(i / 3) - 1;

            if (x == 0 && y == 0) {
                continue;
            }

            screen.save();
            screen.strokeStyle = "#FFFFFF";
            screen.translate(this.center.x - (x * this.gameSize.x), this.center.y - (y * this.gameSize.y));
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

    Player.prototype.drawBullets = function(screen) {
        this.bullets.forEach(function(bullet) {
            bullet.draw(screen);
        });
    };

    Player.prototype.getVertices = function() {
        return rotate([[10, 0], [-10, 6], [-10, -6]], this.momentum.getAngle()).map(function(point) {
            return [point[0] + this.x, point[1] + this.y]
        }.bind(this.center));
    };

    Player.prototype.update = function() {
        if (this.keyboard.isDown(this.keyboard.KEYS.LEFT)) {
            this.angle -= Math.PI/36;
        }

        if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT)) {
            this.angle += Math.PI/36;
        }

        if (this.keyboard.isDown(this.keyboard.KEYS.UP)) {
            this.momentum = this.momentum.add(new CanvasVector(.15, this.angle)).magnatudeRange(0, 3.5);
        }

        if (this.keyboard.isDown(this.keyboard.KEYS.SPACE)) {
            this.attemptToFireBullet();
        }

        this.center.x = modulo(this.center.x + this.momentum.getX(), this.gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), this.gameSize.y);

        this.bullets = this.bullets.filter(function(bullet) {
            return bullet.isValid();
        });

        this.bullets.forEach(function(bullet) {
            bullet.update();
        });
    };

    Player.prototype.attemptToFireBullet = function() {
        this.bullets.push(new Bullet(this.center, new CanvasVector(this.momentum.getMagnatude(), this.angle), this.gameSize));

        return true;
    };

    return Player;
});
