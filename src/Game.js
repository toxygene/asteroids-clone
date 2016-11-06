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

		this.onTickHandler();
    };

	onTickHandler() {
	    var gameSize = { x: this.canvas.width, y: this.canvas.height };

		this.level
		    .update(gameSize)
			.draw(this.context, gameSize);

		requestAnimationFrame(this.onTickHandler);
	};
}
