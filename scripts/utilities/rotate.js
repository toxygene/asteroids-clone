define(function(require) {
    return function (points, angle) {
        return points.map(function(point) {
            var x = point[0],
                y = point[1],
                radians = (Math.PI / 180) * angle,
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (cos * (x)) + (sin * (y)),
                ny = (cos * (y)) - (sin * (x));

            return [nx, ny];
        });
    }
});
