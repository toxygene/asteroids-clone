define(function(require) {
    var Bullet = require('Bullet');
    var CanvasVector = require('CanvasVector');
    var Keyboard = require('Keyboard');
    var modulo = require('utilities/modulo');
    var throttle = require('utilities/throttle');

    var Player = function(game, gameSize) {
        this.game = game;
        this.gameSize = gameSize;
        this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
        this.angle = -Math.PI/2;
        this.momentum = new CanvasVector(0, 0);
        this.size = { x: 10, y: 10 };
        this.keyboard = new Keyboard();
        this.bullets = [];
        this.attemptToFireBullet = throttle(this.attemptToFireBullet.bind(this), 250);

        setInterval(function() {
            this.momentum = this.momentum.addMagnatude(-.1).magnatudeRange(0, 3.5);
        }.bind(this), 50);
    };

    Player.prototype.draw = function(screen, gameSize) {
        this.drawShip(screen, gameSize)
            .drawGhostShips(screen, gameSize)
            .drawBullets(screen, gameSize);
    }

    Player.prototype.drawShip = function(screen, gameSize) {
        screen.save();

        screen.translate(modulo(this.center.x, gameSize.x), modulo(this.center.y, gameSize.y));
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

    Player.prototype.drawGhostShips = function(screen, gameSize) {
        // left
        screen.save();
        screen.translate(modulo(this.center.x, gameSize.x) - gameSize.x, modulo(this.center.y, gameSize.y));
        screen.rotate(this.angle);
        screen.strokeStyle = "#FFFFFF";
        screen.beginPath();
        screen.moveTo(10, 0);
        screen.lineTo(-10, 6);
        screen.lineTo(-10, -6);
        screen.closePath();
        screen.stroke();
        screen.restore();

        // top
        screen.save();
        screen.translate(modulo(this.center.x, gameSize.x), modulo(this.center.y, gameSize.y) - gameSize.y);
        screen.rotate(this.angle);
        screen.strokeStyle = "#FFFFFF";
        screen.beginPath();
        screen.moveTo(10, 0);
        screen.lineTo(-10, 6);
        screen.lineTo(-10, -6);
        screen.closePath();
        screen.stroke();
        screen.restore();

        // right
        screen.save();
        screen.translate(modulo(this.center.x, gameSize.x) + gameSize.x, modulo(this.center.y, gameSize.y));
        screen.rotate(this.angle);
        screen.strokeStyle = "#FFFFFF";
        screen.beginPath();
        screen.moveTo(10, 0);
        screen.lineTo(-10, 6);
        screen.lineTo(-10, -6);
        screen.closePath();
        screen.stroke();
        screen.restore();

        // bottom
        screen.save();
        screen.translate(modulo(this.center.x, gameSize.x), modulo(this.center.y, gameSize.y) + gameSize.y);
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

    Player.prototype.drawBullets = function(screen, gameSize) {
        this.bullets.forEach(function(bullet) {
            bullet.draw(screen, gameSize);
        });
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

        this.center.x += this.momentum.getX();
        this.center.y += this.momentum.getY();

        this.bullets = this.bullets.filter(function(bullet) {
            return bullet.isValid();
        });

        this.bullets.forEach(function(bullet) {
            bullet.update();
        });
    };

    Player.prototype.attemptToFireBullet = function() {
        this.bullets.push(new Bullet(this.center, new CanvasVector(this.momentum.getMagnatude(), this.angle)));

        return true;
    };

    return Player;
});
