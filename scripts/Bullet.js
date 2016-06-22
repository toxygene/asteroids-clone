define(function(require) {
    var modulo = require('utilities/modulo');

    function Bullet(center, momentum) {
        this.center = { x: center.x, y: center.y };
        this.momentum = momentum.addMagnatude(5);
        this.valid = true;

        setTimeout(function() { this.remove(); }.bind(this), 1750);
    };

    Bullet.prototype.draw = function(screen, gameSize) {
        screen.save();
        screen.translate(modulo(this.center.x, gameSize.x), modulo(this.center.y, gameSize.y));
        screen.fillStyle = '#FFFFFF';
        screen.fillRect(-2, -2, 2, 2);
        screen.restore();
    };

    Bullet.prototype.getVertex = function() {
        return [ this.center.x, this.center.y ];
    };

    Bullet.prototype.isValid = function() {
        return this.valid;
    };

    Bullet.prototype.remove = function() {
        this.valid = false;

        return this;
    };

    Bullet.prototype.update = function(gameSize) {
        this.center.x = modulo(this.center.x + this.momentum.getX(), gameSize.x);
        this.center.y = modulo(this.center.y + this.momentum.getY(), gameSize.y);
    };

    return Bullet;
});
