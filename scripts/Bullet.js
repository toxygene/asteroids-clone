define(function(require) {
    var modulo = require('utilities/modulo');

    function Bullet(center, momentum) {
        this.center = { x: center.x, y: center.y };
        this.momentum = momentum.addMagnatude(5);
        this.valid = true;
        this.ticks = 0;
    }

    Bullet.TICKS_VALID_FOR = 75;

    Bullet.prototype.draw = function(screen, gameSize) {
        screen.fillStyle = '#FFFFFF';
        screen.fillRect(this.center.x - 1, this.center.y - 1, 2, 2);
    };

    Bullet.prototype.getVertex = function() {
        return { x: this.center.x, y: this.center.y };
    };

    Bullet.prototype.isValid = function() {
        return this.valid;
    };

    Bullet.prototype.update = function(gameSize) {
        ++this.ticks;

        this.center.x = modulo(this.center.x + this.momentum.getX(), gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), gameSize.y);

        this.valid = this.ticks < Bullet.TICKS_VALID_FOR;
    };

    return Bullet;
});
