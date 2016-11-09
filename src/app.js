"use strict";

import Game from './Game';

document.addEventListener("DOMContentLoaded", function(event) { 
    var game = new Game(document.getElementById('screen'));
    game.start();
});
