// File: main.js

function beginEverything() {
	var myGame = new GameState();
	console.log(myGame.board.contentsOf("o4") + " < < if this says n, everything's gouda");
	renderBoard(myGame);
	console.log("Board renderererer function has finished");
	console.log(myGame);
}

// sleep(ms) function should only be needed for testing.
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function startTheTests() {
	alert("this doesn't actually do anything anymore, sorry");
}