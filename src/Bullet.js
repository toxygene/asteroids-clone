import modulo from './utilities/modulo';

export default class Bullet {
    constructor(center, momentum) {
        this.center = { x: center.x, y: center.y };
        this.momentum = momentum.addMagnatude(5);
        this.valid = true;
        this.ticks = 0;
        this.ticksValidFor = 75;
    }

    draw(screen, gameSize) {
        screen.fillStyle = '#FFFFFF';
        screen.fillRect(this.center.x - 1, this.center.y - 1, 2, 2);
    };

    getVertex() {
        return { x: this.center.x, y: this.center.y };
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

        this.valid = this.ticks < this.ticksValidFor;
    };
};
