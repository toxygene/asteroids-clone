export default class Keyboard {
	constructor() {
	    this.keys = { left: 37, up: 38, right: 39, down: 40, space: 32 };
	    
		this.keyState = {};
		
		window.onkeydown = function(e) {
			this.keyState[e.keyCode] = true;
		}.bind(this);
		
		window.onkeyup = function(e) {
			this.keyState[e.keyCode] = false;
		}.bind(this);
	};
	
	isDown(keyCode) {
		return this.keyState[keyCode] === true;
	};
}
