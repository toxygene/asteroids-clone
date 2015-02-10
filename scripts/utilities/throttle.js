define(function(require) {
    return function(callback, timeout) {
		return function() {
			if (typeof this.throttled === 'undefined') {
				this.throttled = false;
			}
			
			if (!this.throttled) {
				this.throttled = true;
				setTimeout(function() { this.throttled = false; }.bind(this), 350);
				this.call();
			}
		}.bind(callback);
	};
});
