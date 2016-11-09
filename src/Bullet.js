"use strict";

import modulo from './utilities/modulo';

export default class Bullet {
    constructor(center, momentum) {
        this.bulletTimeToLive = 1000;
        this.center = { x: center.x, y: center.y };
        this.elapsedTime = 0;
        this.momentum = momentum.addMagnatude(400);
        this.valid = true;
    };

    draw(screen, gameSize) {
        screen.fillStyle = '#FFFFFF';
        screen.fillRect(this.center.x - 1, this.center.y - 1, 2, 2);
    };

    getVertex() {
        return { x: this.center.x, y: this.center.y };
    };

    isValid() {
        return this.valid === true && this.elapsedTime < this.bulletTimeToLive;
    };

    remove() {
        this.valid = false;

        return this;
    };

    update(gameSize, elapsedTime) {
        this.center.x = modulo(this.center.x + (this.momentum.getX() * (elapsedTime / 1000)), gameSize.x);
        this.center.y = modulo(this.center.y + (this.momentum.getY() * (elapsedTime / 1000)), gameSize.y);

        this.elapsedTime += elapsedTime;
    };
};
