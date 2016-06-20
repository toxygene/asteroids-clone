define(function(require) {
    var modulo = require('utilities/modulo');

    function Bullet(center, momentum, gameSize) {
        this.center = { x: center.x, y: center.y };
        this.momentum = momentum.addMagnatude(5);
        this.valid = true;
        this.gameSize = gameSize;

        setTimeout(function() { this.valid = false; }.bind(this), 1750);
    };

    Bullet.prototype.draw = function(screen) {
        screen.save();
        screen.translate(modulo(this.center.x, this.gameSize.x), modulo(this.center.y, this.gameSize.y));
        screen.fillStyle = '#FFFFFF';
        screen.fillRect(-2, -2, 2, 2);
        screen.restore();
    };

    Bullet.prototype.isValid = function() {
        return this.valid;
    };

    Bullet.prototype.update = function() {
        this.center.x = modulo(this.center.x + this.momentum.getX(), this.gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), this.gameSize.y);
    };

    return Bullet;
});
