define(function(require) {
    var Level = require('Level');

    var Game = function(canvas) {
        this.canvas  = canvas;
		this.context = canvas.getContext('2d');

		this.onTickHandler = this.onTickHandler.bind(this);
    };

    Game.prototype.start = function() {
        this.level = new Level();

		this.onTickHandler();
    };

	Game.prototype.onTickHandler = function() {
	    var gameSize = { x: this.canvas.width, y: this.canvas.height };

		this.level
		    .update(gameSize)
			.draw(this.context, gameSize);

		requestAnimationFrame(this.onTickHandler);
	};

    return Game;
});
