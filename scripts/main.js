;(function() {
	Function.prototype.throttle = function(timeout) {
		return function() {
			if (typeof this.throttled === 'undefined') {
				this.throttled = false;
			}
			
			if (!this.throttled) {
				this.throttled = true;
				setTimeout(function() { this.throttled = false; }.bind(this), 350);
				this.call();
			}
		}.bind(this);
	};
	
	Number.prototype.modulo = function(n) {
		return ((this%n)+n)%n;
	};
	
	Math.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	};
	
	Math.randomGaussian = function(mean, standardDeviation) {
		if (Math.randomGaussian.nextGaussian !== undefined) {
			var nextGaussian = Math.randomGaussian.nextGaussian;
			delete Math.randomGaussian.nextGaussian;
			return (nextGaussian * standardDeviation) + mean;
		} else {
			var v1, v2, s, multiplier;
			do {
				v1 = 2 * Math.random() - 1; // between -1 and 1
				v2 = 2 * Math.random() - 1; // between -1 and 1
				s = v1 * v1 + v2 * v2;
			} while (s >= 1 || s == 0);
			multiplier = Math.sqrt(-2 * Math.log(s) / s);
			Math.randomGaussian.nextGaussian = v2 * multiplier;
			return (v1 * multiplier * standardDeviation) + mean;
		}
	};

    requirejs(['Asteroids'], function(Asteroids) {
        new Asteroids('screen');
    });
})();
