define(function(require) {
    return function(vertices) {
        var angleSteps = [];
        var numberAngles = 2 * Math.PI / vertices;
        var sum = 0;

        for (var i = 0; i < vertices; ++i) {
            var tmp = numberAngles;
            angleSteps.push(tmp);
            sum += tmp;
        }

        var k = sum / (2 * Math.PI);
        for (i = 0; i < vertices; ++i) {
            angleSteps[i] = angleSteps[i] / k;
        }

        var points = [];
        var angle = Math.random(0, 2 * Math.PI);

        for (i = 0; i < vertices; ++i) {
            var r_i = Math.max(0, Math.min(Math.randomGaussian(40, 20), 80));
            var x = r_i * Math.cos(angle);
            var y = r_i * Math.sin(angle);

            points.push({ x: parseInt(x), y: parseInt(y) });

            angle += angleSteps[i];
        }

        return points;
    };
});
