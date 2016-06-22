define(function(require) {
    return function (points, radians) {
        return points.map(function(point) {
            var x = point[0],
                y = point[1],
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (cos * (x)) + (sin * (y)),
                ny = (cos * (y)) - (sin * (x));

            return [nx, ny];
        });
    }
});
