;(function() {
	var Asteroids = function(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.screen = this.canvas.getContext('2d');
		this.gameSize = { x: this.canvas.width, y: this.canvas.height };
		this.player = new Player(this, this.gameSize);

		this.onTickHandler = this.onTickHandler.bind(this);

		this.onTickHandler();
	};
	
	Asteroids.prototype.draw = function(screen, gameSize) {
		screen.save();
		screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y);
		screen.fillStyle = "#000000";
		screen.fillRect(0, 0, this.gameSize.x, this.gameSize.y);
		screen.restore();

		this.player.draw(screen, gameSize);

		return this;
	};
	
	Asteroids.prototype.onTickHandler = function() {
		this.update()
			.draw(this.screen, this.gameSize);

		requestAnimationFrame(this.onTickHandler);
	};
	
	Asteroids.prototype.update = function() {
		this.player.update();
		
		return this;
	};

	var Player = function(game, gameSize) {
		this.game = game;
		this.gameSize = gameSize;
		this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };
		this.angle = -Math.PI/2;
		this.momentum = new CanvasVector(0, 0);
		this.size = { x: 10, y: 10 };
		this.keyboard = new Keyboard();
		this.speed = 0;
		this.canShoot = true;

		setInterval(function() {
			this.momentum = this.momentum.subtractMagnatude(.1);
		}.bind(this), 100);
	};
	
	Player.prototype.draw = function(screen, gameSize) {	
		screen.save();
		screen.translate(this.center.x, this.center.y);
		screen.rotate(this.angle);
		screen.strokeStyle = "#FFFFFF";
		screen.beginPath();
		screen.moveTo(10, 0);
		screen.lineTo(-10, 6);
		screen.lineTo(-10, -6);
		screen.closePath();
		screen.stroke();
		screen.restore();
	};

	Player.prototype.update = function() {
		if (this.keyboard.isDown(this.keyboard.KEYS.LEFT)) {
			this.angle -= Math.PI/36;
		}
		
		if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT)) {
			this.angle += Math.PI/36;
		}
		
		if (this.keyboard.isDown(this.keyboard.KEYS.UP)) {
			this.momentum = this.momentum.addMagnatudeAndAngle(.5, this.angle).limitMagnatude(2.5);
		}

		this.center.x += this.momentum.x;
		this.center.y += this.momentum.y;
	};
	
	var Keyboard = function() {
		this.keyState = {};
		
		window.onkeydown = function(e) {
			this.keyState[e.keyCode] = true;
		}.bind(this);
		
		window.onkeyup = function(e) {
			this.keyState[e.keyCode] = false;
		}.bind(this);
	};
	
	Keyboard.prototype.isDown = function(keyCode) {
		return this.keyState[keyCode] === true;
	};

	Keyboard.prototype.KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32 };
	
	function CanvasVector(x, y) {
		this.x = x;
		this.y = y;
	};
	
	CanvasVector.prototype.magnatude = function() {
		return Math.sqrt((this.x*this.x)+(this.y*this.y));
	};
	
	CanvasVector.prototype.angle = function() {
		return Math.atan2(this.y, this.x);
	};
	
	CanvasVector.prototype.add = function(that) {
		return new CanvasVector(this.x+that.x, this.y+that.y);
	};
	
	CanvasVector.prototype.limitMagnatude = function(magnatude) {
		if (this.magnatude() <= magnatude) {
			return this;
		}
		
		var x = magnatude*Math.cos(this.angle());
		var y = magnatude*Math.sin(this.angle())
		
		return new CanvasVector(x, y);
	};
	
	CanvasVector.prototype.subtractMagnatude = function(amount) {
		if (this.magnatude() - amount < 0) {
			return new CanvasVector(0, 0);
		}
		
		return this.limitMagnatude(this.magnatude() - amount);
	};
	
	CanvasVector.prototype.addMagnatudeAndAngle = function(magnatude, angle) {
		return this.add(new CanvasVector(magnatude*Math.cos(angle),magnatude*Math.sin(angle)));
	};

	window.onload = function() {
		new Asteroids('screen');
	};
})();
