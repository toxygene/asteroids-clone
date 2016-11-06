import CanvasVector from './CanvasVector';
import modulo from './utilities/modulo';
import rotate from './utilities/rotate';

export default class Disintegration {
    constructor(vertices) {
        this.time_to_live = 50;

        this.pieces = [];
        this.ticks = 0;
        this.valid = true;

        for (var i = 0; i < vertices.length; ++i) {
            var momentum = new CanvasVector(Math.random(), Math.getRandomInt(-Math.PI/4, Math.PI/4));
            var rotation = (Math.random() * (Math.PI / 32)) - (Math.PI / 64);

            if (i + 1 == vertices.length) {
                this.pieces.push([vertices[i], vertices[0], momentum, rotation]);
            } else {
                this.pieces.push([vertices[i], vertices[i + 1], momentum, rotation]);
            }
        }
    };

    draw(screen, gameSize) {
        screen.save();
        screen.strokeStyle = '#FFF';
        screen.globalAlpha = 1 - (this.ticks / this.time_to_live);

        this.pieces.forEach(function(piece) {
            screen.beginPath();
            screen.moveTo(piece[0].x, piece[0].y);
            screen.lineTo(piece[1].x, piece[1].y);
            screen.closePath();

            screen.stroke();
        });

        screen.restore();

        return this;
    };

    isValid() {
        return this.ticks < this.time_to_live;
    }

    update(gameSize) {
        this.pieces = this.pieces.map(function(piece) {
            var center = { x: (piece[0].x + piece[1].x) / 2, y: (piece[0].y + piece[1].y) / 2 };
            var rotated = rotate([piece[0], piece[1]], piece[3], center);

            return [
                { x: rotated[0].x + piece[2].getX(), y: rotated[0].y + piece[2].getY() },
                { x: rotated[1].x + piece[2].getX(), y: rotated[1].y + piece[2].getY() },
                piece[2],
                piece[3]
            ];
        });

        this.ticks += 1;
    };
}
