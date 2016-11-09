"use strict";

import Level from './Level';

export default class Game {
    constructor(canvas) {
        this.canvas  = canvas;
		this.context = canvas.getContext('2d');

		this.onTickHandler = this.onTickHandler.bind(this);
    }
    
    start() {
        this.level = new Level();

        this.last = Date.now();
		this.onTickHandler();
    };

	onTickHandler() {
	    var now = Date.now();
	    var gameSize = { x: this.canvas.width, y: this.canvas.height };

		this.level
		    .update(gameSize, now - this.last)
			.draw(this.context, gameSize);

        this.last = now;

		requestAnimationFrame(this.onTickHandler);
	};
}
