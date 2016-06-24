define(function(require) {
    return function (points, radians, center) {
        return points.map(function(point) {
            var x = point.x - center.x,
                y = point.y - center.y,
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (x * cos) + (y * sin) + center.x,
                ny = -(x * sin) + (y * cos) + center.y;

            return { x: nx, y: ny };
        });
    }
});
