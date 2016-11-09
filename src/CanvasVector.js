"use strict";

export default class CanvasVector {
    constructor(magnatude, angle) {
        this.magnatude = magnatude;
        this.angle = angle;
    }

    getX() {
        return this.getMagnatude() * Math.cos(this.getAngle());
    };

    getY() {
        return this.getMagnatude() * Math.sin(this.getAngle());
    };

    getMagnatude() {
        return this.magnatude;
    };

    getAngle() {
        return this.angle;
    };

    add(that) {
        var x = this.getX() + that.getX();
        var y = this.getY() + that.getY();

        var magnitude = Math.sqrt((x*x)+(y*y));
        var angle = Math.atan2(y, x);

        return new CanvasVector(magnitude, angle);
    };

    addMagnatude(magnatude) {
        return new CanvasVector(this.getMagnatude() + magnatude, this.getAngle());
    };

    magnatudeRange(min, max) {
        if (this.getMagnatude() < min) {
            return new CanvasVector(min, this.getAngle());
        } else if (this.getMagnatude() > max) {
            return new CanvasVector(max, this.getAngle());
        }

        return this;
    };
}
