function mbcO(x) {
	// simulates calling myboard.contentsOf(x)
	return testArray[baseArray.indexOf(x)];
}
function flip() {
	// flips four dice and stores the result (0 or 1) in rollResult[0,1,2,3].
	var j;
	totalRoll = 0;
	for (j = 0; j < 4; j++) {
		rollResult[j] = Math.floor(Math.random() * 2);
		totalRoll += rollResult[j];
	}
	console.log("Rolled " + rollResult + " for a total of " + totalRoll);
	return totalRoll;
}
function renderFromArray() {
	// baseArray[x] will "return" the string address of the cell with number address x, similar with diceLabel[x]
	baseArray = ["o4","o3","o2","o1","o6","o5","m1","m2","m3","m4","m5","m6","m7","m8","b4","b3","b2","b1","b6","b5"];
	diceLabel = ["dicea","diceb","dicec","diced"];
	// to be used later in part 2 of the renderer. previously entries 20 to 29 of the game state array
	statsArray = [1,3,3,0,1,0,0,1,0,25];
	// a test array that already has the state of the board loaded in
	testArray = ["o","o","n","n","n","n","o","b","n","b","n","b","n","n","n","n","n","n","n","b"];
	// it won't let me do "a string".concat("more strings"), i have to declare a variable first.
	var imgstr = "img/";
	// two variables for the dice
	rollResult = [1,0,1,1];
	var totalRoll = 0;
	var j;
	for (j = 0; j < 20; j++) {
		document.getElementById(baseArray[j]).src = imgstr.concat("icon",mbcO(baseArray[j]),".png");
		/*   for example,                                                mcbO(    "m2"    )
		document.getElementById(    "m2"    ).src = "   img /      icon        b             .png" ; */
	}
	flip(); // we now have new rollResult and totalRoll
	for (j = 0; j < 4; j++) {
		document.getElementById(diceLabel[j]).src = imgstr.concat("d",rollResult[j],".png");
		//   for example,      (  "dicec"   ).src = "   img /      d      0          .png");
	}
}
function renderBoard(myGame) {
	// pseudo-function? baseArray[x] returns the cell ID of cell number x (e.g. cell #0 = "o4")
	baseArray = ["o4","o3","o2","o1","o6","o5","m1","m2","m3","m4","m5","m6","m7","m8","b4","b3","b2","b1","b6","b5"];
	diceLabel = ["dicea","diceb","dicec","diced"];
	var imgstr = "img/";
	// renders the playing board
	for (j = 0; j < 20; j++) {
		document.getElementById(baseArray[j]).src = imgstr.concat("icon",myGame.board.contentsOf(baseArray[j]),".png");
		/*   for example,                                                myGame.board.contentsOf(    "m2"    )
		document.getElementById(    "m2"    ).src = "   img /      icon                           b             .png" ; */
	}
	// renders the dice
	for (j = 0; j < 4; j++) {
		// this should turn true into 1, false into 0 (thanks stackoverflow i have no idea how this works but they say it does)
		var tempDiceValue = myGame.dice[j] ? 1 : 0;
		document.getElementById(diceLabel[j]).src = imgstr.concat("d",tempDiceValue,".png");
		//   for example,      (  "dicec"   ).src = "   img /      d      0          .png");
	}
	// renders the score and reserve slots
	document.getElementById("oscore").src = imgstr.concat("score/sco",myGame.board.oHome,".png");
	document.getElementById("bscore").src = imgstr.concat("score/scb",myGame.board.bHome,".png");
	document.getElementById("ores").src = imgstr.concat("reserve/",myGame.board.oPot,".png");
	document.getElementById("bres").src = imgstr.concat("reserve/",myGame.board.bPot,".png");

}
function clicked(cell) {
	console.log("Cell " + cell + " has been clicked.");
}