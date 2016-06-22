define(function(require) {
    return function (points, radians) {
        return points.map(function(point) {
            var x = point[0],
                y = point[1]
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (x * cos) + (y * sin),
                ny = -(x * sin) + (y * cos);

            return [nx, ny];
        });
    }
});
