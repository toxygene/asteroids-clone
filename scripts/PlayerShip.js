define(function(require) {
    var Bullet = require('Bullet');
    var CanvasVector = require('CanvasVector');
    var Keyboard = require('Keyboard');
    var modulo = require('utilities/modulo');
    var rotate = require('utilities/rotate');

    var PlayerShip = function(center, fireBullet) {
        this.angle = Math.PI/2;
        this.center = center;
        this.fireBullet = fireBullet;
        this.momentum = new CanvasVector(0, this.angle);
        this.keyboard = new Keyboard();
        this.bullets = [];
        this.valid = true;
        this.ticksSinceLastShot = PlayerShip.MIN_BULLET_THROTTLE;
    };

    PlayerShip.COLOR               = '#FFF';
    PlayerShip.MAGNATUDE_DECAY     = 0.04;
    PlayerShip.MAX_BULLETS         = 5;
    PlayerShip.MAX_MAGNATUDE       = 3.5;
    PlayerShip.MIN_BULLET_THROTTLE = 15;
    PlayerShip.SHAPE               = [
        { x: 10, y: 0 },
        { x: 0, y: 3 },
        { x: -10, y: 6 },
        { x: -10, y: -6 },
        { x: 0, y: -3 }
    ];

    PlayerShip.prototype.attemptToFireBullet = function() {
        if (this.ticksSinceLastShot > PlayerShip.MIN_BULLET_THROTTLE && this.bullets.length < PlayerShip.MAX_BULLETS) {
            var bullet = new Bullet(this.getVertices()[0], new CanvasVector(2, -this.angle), this.gameSize);
            this.bullets.push(bullet);
            this.fireBullet(bullet);
            this.ticksSinceLastShot = 0;
        }

        return true;
    };

    PlayerShip.prototype.draw = function(screen, gameSize) {
        this.drawShip(screen, gameSize)
            .drawGhostShips(screen, gameSize);
    };

    PlayerShip.prototype.drawShip = function(screen, gameSize) {
        var vertices = this.getVertices();
        var first    = vertices.shift();

        screen.beginPath();
        screen.strokeStyle = PlayerShip.COLOR;
        screen.moveTo(first.x, first.y);
        vertices.forEach(function(vertex) {
            screen.lineTo(vertex.x, vertex.y);
        });
        screen.closePath();
        screen.stroke();

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

            var vertices = this.getVertices();
            var first    = vertices.shift();

            screen.strokeStyle = PlayerShip.COLOR;
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

    PlayerShip.prototype.getVertices = function() {
        return rotate(PlayerShip.SHAPE, this.angle, { x: 0, y: 0}).map(function(point) {
            return { x: point.x + this.x, y: point.y + this.y };
        }.bind(this.center));
    };

    PlayerShip.prototype.isValid = function() {
        return this.valid;
    };

    PlayerShip.prototype.remove = function() {
        this.valid = false;

        return this;
    };

    PlayerShip.prototype.update = function(gameSize) {
        ++this.ticksSinceLastShot;

        this.momentum = this.momentum.addMagnatude(-PlayerShip.MAGNATUDE_DECAY).magnatudeRange(0, PlayerShip.MAX_MAGNATUDE);

        if (this.keyboard.isDown(this.keyboard.KEYS.LEFT)) {
            this.angle += Math.PI/36;
        }

        if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT)) {
            this.angle -= Math.PI/36;
        }

        this.angle = modulo(this.angle, 2 * Math.PI);

        if (this.keyboard.isDown(this.keyboard.KEYS.UP)) {
            this.momentum = this.momentum.add(new CanvasVector(.15, -this.angle)).magnatudeRange(0, PlayerShip.MAX_MAGNATUDE);
        }

        if (this.keyboard.isDown(this.keyboard.KEYS.SPACE)) {
            this.attemptToFireBullet();
        }

        this.center.x = modulo(this.center.x + this.momentum.getX(), gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), gameSize.y);

        this.bullets = this.bullets.filter(function(bullet) {
            return bullet.isValid();
        });
    };

    return PlayerShip;
});
