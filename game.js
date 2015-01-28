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
		this.angle = 0;
		this.size = { x: 10, y: 10 };
		this.keyboard = new Keyboard();
		this.bullets = [];
		this.shotTimeout = 0;
		this.speed = 0;
	};
	
	Player.prototype.draw = function(screen, gameSize) {
		screen.save();
		screen.translate(this.center.x, this.center.y);
		screen.rotate(this.angle);
		screen.strokeStyle = "#FFFFFF";
		screen.beginPath();
		screen.moveTo(0, -10);
		screen.lineTo(-6, 10);
		screen.lineTo(6, 10);
		screen.closePath();
		screen.stroke();
		screen.restore();
		
		this.bullets.forEach(function(bullet) {
			bullet.draw(screen, gameSize);
		});
	};
	
	Player.prototype.fireBullet = function() {
		if (this.shotTimeout == 0) {
			this.shotTimeout = 15;
			this.bullets.push(new Bullet({ x: this.center.x, y: this.center.y }, this.angle, this.speed));
		}
	};

	Player.prototype.update = function() {
		if (this.keyboard.isDown(this.keyboard.KEYS.LEFT)) {
			this.angle -= (Math.PI/3)/12;
		}
		
		if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT)) {
			this.angle += (Math.PI/3)/12;
		}
		
		this.angle = ((this.angle % (2*Math.PI)) + (2*Math.PI)) % (2*Math.PI);
		
		if (this.keyboard.isDown(this.keyboard.KEYS.UP)) {
			this.speed = 1.75;
			this.center.y -= 1.75 * Math.cos(0 + this.angle);
			this.center.x += 1.75 * Math.sin(0 + this.angle);
		} else {
			this.speed = 0;
		}
		
		if (this.keyboard.isDown(this.keyboard.KEYS.SPACE)) {
			this.fireBullet();
		}
		
		this.bullets.forEach(function(bullet) {
			bullet.update();
		});
		
		this.bullets = this.bullets.filter(function(bullet) {
			return !bullet.isValid();
		});
		
		this.shotTimeout = Math.max(
			this.shotTimeout - 1,
			0
		);
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
	
	var Bullet = function(center, angle, speed) {
		this.timer = 0;
		this.center = center;
		this.angle = angle;
		this.speed = speed;
	};
	
	Bullet.prototype.draw = function(screen, gameSize) {
		screen.save();
		screen.translate(this.center.x, this.center.y);
		screen.rotate(this.angle);
		screen.strokeStyle = "#FFFFFF";
		screen.beginPath();
		screen.moveTo(0, 0);
		screen.lineTo(0, 4);
		screen.closePath();
		screen.stroke();
		screen.restore();
	};
	
	Bullet.prototype.isValid = function() {
		return this.timer == 100;
	}
	
	Bullet.prototype.update = function() {
		++this.timer;
		this.center.y -= (this.speed + 2.25) * Math.cos(0 + this.angle);
		this.center.x += (this.speed + 2.25) * Math.sin(0 + this.angle);
	};
	
	window.onload = function() {
		new Asteroids('screen');
	};
})();