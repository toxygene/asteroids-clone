"use strict";

import getRandomInt from './getRandomInt';

export default function(minRadius, maxRadius, granularity, minVary, maxVary) {
    var points = [];

    for(var angle = 0; angle < 2 * Math.PI; angle += (2 * Math.PI) / granularity) {
        var angleVaryPc = getRandomInt(minVary, maxVary);
        var angleVaryRadians = (2 * Math.PI / granularity) * (angleVaryPc / 100);
        var angleFinal = angle + angleVaryRadians - (Math.PI / granularity);
        var radius = getRandomInt(minRadius, maxRadius);
        var x = Math.sin(angleFinal) * radius;
        var y = -Math.cos(angleFinal) * radius;
        points.push({ x: x, y: y});
    }

    return points;
}
