require(function(require) {
	function Bullet(center, momentum) {
		this.center = { x: center.x, y: center.y };
		this.momentum = momentum.addMagnatude(5);
		this.valid = true;
		
		setTimeout(function() { this.valid = false; }.bind(this), 1750);
	};
	
	Bullet.prototype.draw = function(screen, gameSize) {
		screen.save();
		screen.translate(this.center.x.modulo(gameSize.x), this.center.y.modulo(gameSize.y));
		screen.fillStyle = '#FFFFFF';
		screen.fillRect(-2, -2, 2, 2);
		screen.restore();
	};
	
	Bullet.prototype.isValid = function() {
		return this.valid;
	};
	
	Bullet.prototype.update = function() {
		this.center.x += this.momentum.getX();
		this.center.y += this.momentum.getY();
	};
	
	return Bullet;
});
