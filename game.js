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
		this.bullets = [];
		this.attemptToFireBullet = this.attemptToFireBullet.bind(this).throttle(250);
		
		setInterval(function() {
			this.momentum = this.momentum.addMagnatude(-.1).magnatudeRange(0, 3.75);
		}.bind(this), 75);
	};
	
	Player.prototype.draw = function(screen, gameSize) {	
		screen.save();
		screen.translate(this.center.x.modulo(gameSize.x), this.center.y.modulo(gameSize.y));
		screen.rotate(this.angle);
		screen.strokeStyle = "#FFFFFF";
		screen.beginPath();
		screen.moveTo(10, 0);
		screen.lineTo(-10, 6);
		screen.lineTo(-10, -6);
		screen.closePath();
		screen.stroke();
		screen.restore();
		
		this.bullets.forEach(function(bullet) {
			bullet.draw(screen, gameSize);
		});
	};

	Player.prototype.update = function() {
		if (this.keyboard.isDown(this.keyboard.KEYS.LEFT)) {
			this.angle -= Math.PI/36;
		}
		
		if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT)) {
			this.angle += Math.PI/36;
		}
		
		if (this.keyboard.isDown(this.keyboard.KEYS.UP)) {
			this.momentum = this.momentum.add(new CanvasVector(.5, this.angle)).magnatudeRange(0, 2);
		}
		
		if (this.keyboard.isDown(this.keyboard.KEYS.SPACE)) {
			this.attemptToFireBullet();
		}

		this.center.x += this.momentum.getX();
		this.center.y += this.momentum.getY();
		
		this.bullets = this.bullets.filter(function(bullet) {
			return bullet.isValid();
		});

		this.bullets.forEach(function(bullet) {
			bullet.update();
		});
	};
	
	Player.prototype.attemptToFireBullet = function() {
		this.bullets.push(new Bullet(this.center, new CanvasVector(this.momentum.getMagnatude(), this.angle)));
		
		return true;
	};
	
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
	
	function CanvasVector(magnatude, angle) {
		this.magnatude = magnatude;
		this.angle = angle;
	};
	
	CanvasVector.prototype.getX = function() {
		return this.getMagnatude() * Math.cos(this.getAngle());
	};
	
	CanvasVector.prototype.getY = function() {
		return this.getMagnatude() * Math.sin(this.getAngle());
	};
	
	CanvasVector.prototype.getMagnatude = function() {
		return this.magnatude;
	};
	
	CanvasVector.prototype.getAngle = function() {
		return this.angle;
	};
	
	CanvasVector.prototype.add = function(that) {
		var x = this.getX() + that.getX();
		var y = this.getY() + that.getY();
		
		var magnatude = Math.sqrt((x*x)+(y*y));
		var angle = Math.atan2(y, x);
		
		return new CanvasVector(magnatude, angle);
	};
	
	CanvasVector.prototype.addMagnatude = function(magnatude) {
		return new CanvasVector(this.getMagnatude() + magnatude, this.getAngle());
	};
	
	CanvasVector.prototype.magnatudeRange = function(min, max) {
		if (this.getMagnatude() < min) {
			return new CanvasVector(min, this.getAngle());
		} else if (this.getMagnatude() > max) {
			return new CanvasVector(max, this.getAngle());
		}
		
		return this;
	};

	window.onload = function() {
		new Asteroids('screen');
	};
})();
