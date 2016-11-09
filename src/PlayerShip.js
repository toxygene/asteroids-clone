"use strict";

import Bullet from './Bullet';
import CanvasVector from './CanvasVector';
import modulo from './utilities/modulo';
import rotate from './utilities/rotate';

export default class PlayerShip {
    constructor(initialCenter) {
        this.accerlationAmount = 1000;
        this.angle = Math.PI/2;
        this.center = initialCenter;
        this.color = '#FFF';
        this.dragAmount = 175;
        this.fireBulletCooldown = 0;
        this.maxMagnatude = 225;
        this.shape = [
            { x: 10, y: 0 },
            { x: 0, y: 3 },
            { x: -10, y: 6 },
            { x: -10, y: -6 },
            { x: 0, y: -3 }
        ];
        this.turnAmount = 5;
        this.valid = true;
        
        this.momentum = new CanvasVector(0, this.angle);
    };
    
    accelerate(percent) {
        this.momentum = this.momentum.add(new CanvasVector(this.accerlationAmount * percent, -this.angle)).magnatudeRange(0, this.maxMagnatude);
        
        return this;
    }

    draw(screen, gameSize) {
        this.drawShip(screen, gameSize)
            .drawGhostShips(screen, gameSize);
            
        return this;
    };

    drawShip(screen, gameSize) {
        var vertices = this.getVertices();
        var first    = vertices.shift();

        screen.beginPath();
        screen.strokeStyle = this.color;
        screen.moveTo(first.x, first.y);
        vertices.forEach(function(vertex) {
            screen.lineTo(vertex.x, vertex.y);
        });
        screen.closePath();
        screen.stroke();

        return this;
    };

    drawGhostShips(screen, gameSize) {
        for (var i = 0; i < 9; ++i) {
            var x = modulo(i, 3) - 1;
            var y = Math.floor(i / 3) - 1;

            if (x == 0 && y == 0) {
                continue;
            }

            screen.save();

            var vertices = this.getVertices();
            var first    = vertices.shift();

            screen.strokeStyle = this.color;
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

    getVertices() {
        return rotate(this.shape, this.angle, { x: 0, y: 0}).map(function(point) {
            return { x: point.x + this.x, y: point.y + this.y };
        }.bind(this.center));
    };

    isValid() {
        return this.valid;
    };

    remove() {
        this.valid = false;

        return this;
    };
    
    turnLeft(percent) {
        this.angle = modulo(this.angle + (this.turnAmount * percent), 2 * Math.PI);
        
        return this;
    };
    
    turnRight(percent) {
        this.angle = modulo(this.angle - (this.turnAmount * percent), 2 * Math.PI);
        
        return this;
    };

    update(gameSize, elapsedTime) {
        this.momentum = this.momentum.addMagnatude(-this.dragAmount * (elapsedTime / 1000)).magnatudeRange(0, this.maxMagnatude);

        this.center.x += this.momentum.getX() * (elapsedTime / 1000);
        this.center.y += this.momentum.getY() * (elapsedTime / 1000);

        this.center.x = modulo(this.center.x, gameSize.x);
        this.center.y = modulo(this.center.y, gameSize.y);
    };
};
