define(function(require) {
    var Disintegration = function(vertices) {
        this.ticks = 0;
        this.valid = true;

        this.lines = [];
        for (var i = 0; i < vertices.length; ++i) {
            if (i + 1 == vertices.length) {
                this.lines.push([vertices[i], vertices[0]]);
            } else {
                this.lines.push([vertices[i], vertices[i + 1]]);
            }
        }
    };

    Disintegration.TIME_TO_LIVE = 50;

    Disintegration.prototype.draw = function(screen, gameSize) {
        screen.save();

        screen.translate(0, 0);
        screen.strokeStyle = "#999";

        var percentComplete = this.ticks / Disintegration.TIME_TO_LIVE;
        var color = Math.floor(0x9 - (0x9 * percentComplete));
        screen.strokeStyle = '#' + color.toString(16).repeat(3);

        screen.beginPath();
        this.lines.forEach(function(line) {
            screen.moveTo(line[0][0], line[0][1]);
            screen.lineTo(line[1][0], line[1][1]);
        });
        screen.closePath();

        screen.stroke();

        screen.restore();

        return this;
    };

    Disintegration.prototype.isValid = function() {
        return this.ticks < Disintegration.TIME_TO_LIVE;
    }

    Disintegration.prototype.update = function(gameSize) {
        this.ticks += 1;
    };

    return Disintegration;
});
