define(function(require) {
    var Bullet = require('Bullet');
    var CanvasVector = require('CanvasVector');
    var Keyboard = require('Keyboard');

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
			this.momentum = this.momentum.addMagnatude(-.1).magnatudeRange(0, 3.5);
		}.bind(this), 50);
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
			this.momentum = this.momentum.add(new CanvasVector(.15, this.angle)).magnatudeRange(0, 3.5);
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

	return Player;
});
