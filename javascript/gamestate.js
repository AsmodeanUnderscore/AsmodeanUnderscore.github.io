/* File: gamestate.js
* Author: AJFarmar August 2019
*/

// This class holds the game state, in other words all information relating to
// whose turn it is, dice rolling, et cetera.

// EXAMPLE: Setting up a new gamestate
// > var myGame = new GameState();
// > console.log(myGame.currentPlayer); // => "o"
// > console.log(myGame.currentRoll); // => 3
// > console.log(myGame.availableMoves); // => []
// > console.log(myGame.availableIntro); // => true

// EXAMPLE: Performing a few intros
// > console.log(myGame.currentRoll); // => 3
// > myGame.performIntro();
// > console.log(myGame.currentPlayer); // => "b"
// > console.log(myGame.currentRoll); // => 4
// > myGame.performIntro();
// > console.log(myGame.currentPlayer); // => "b"

class GameState {
    
    // Initial setup.
    constructor(startingPlayer = "o") {
        // We set up a new board state.
        this.board = new BoardState();
		
		// This is the zeroth turn, since nothing's happened yet:
		this.turnCount = 0;
        
        // We set the current player.
        this.currentPlayer = startingPlayer;
        
        // We set default move info.
        this.dice = [false, false, false, false];
        this.currentRoll = 0;
        this.availableMoves = new Array();
        this.availableIntro = false;
        
        // We set the current winner, in this case nobody.
        this.winner = "n";
        
        // We setup the first turn.
        this.setupTurn();
    }
    
    
    // Switch players
    switchPlayers() {
        switch (this.currentPlayer) {
            case "o": this.currentPlayer = "b"; break;
            case "b": this.currentPlayer = "o"; break;
        }
        
        // Return this for method chaining
        return this;
    }
    
    // Roll new dice.
    rollDice() {
        let oneDie = () => (Math.random() > 0.5);
        this.dice = [oneDie(), oneDie(), oneDie(), oneDie()];
        this.currentRoll = this.dice.filter(b => b).length;
        
        // Return this for method chaining.
        return this;
    }
    
    
    // Calculate the start of a turn, by rolling dice and finding all moves.
    setupTurn() {
        // Roll the dice.
        this.rollDice();
        // Get all valid moves.
        this.availableMoves = this.board.findValidMoves(this.currentPlayer, this.currentRoll);
        // See if an introduction is valid.
        this.availableIntro = this.board.introIsValid(this.currentPlayer, this.currentRoll);
        // Check if someone has won.
        this.winner = this.board.winner();
        
        // Return this for method chaining.
        return this;
    }
    
    
    // Performs a move and moves onto the next turn depending on the outcome of that move.
    performMove(coord) {
        if (!this.board.verifyCoord(coord)) throw new RangeError("Coordinate \"" + coord + "\" is invalid.");
        if (!this.availableMoves.includes(coord)) throw new Error("Move from \"" + coord + "\" is invalid.");
        
        // Since we have already checked that the move is valid, we can use .checklessPerformMove().
        let result = this.board.checklessPerformMove(coord, this.currentRoll);
        // If we haven't landed on a rosette:
        if (result == 0) this.switchPlayers();
        // Set up the next turn
        this.setupTurn();
        
        // Return this for method chaining
        return this;
    }
    
    
    // Performs an introduction and moves onto the next turn depending on the outcome of that introduction.
    performIntro() {
        if (!this.availableIntro) throw new Error("Introduction is invalid.");
        
        // Since we have already checked that the intro is valid, we can use .checklessPerformIntro().
        let result = this.board.checklessPerformIntro(this.currentPlayer, this.currentRoll);
        // If we haven't landed on a rosette:
        if (result == 0) this.switchPlayers();
        // Set up the next turn
        this.setupTurn();
        
        // Return this for method chaining
        return this;
    }
    
    
    // In the case that no move can be made, we must abdicate.
    abdicate() {
        if (this.availableMoves.length != 0 || this.availableIntro) throw new Error("Abdication invalid.");
        this.switchPlayers(); 
        this.setupTurn();
        
        // Return this for method chaining
        return this;
    }
}

// This allows this file to be tested
// add "async" to the start of this function if you want to use the sleep version
function gameTests() {
    console.log(">>> Random tests.");
    // this version is the sleep version
	/* for (let i = 1; i <= 1000 && myGame.winner == "n"; i++) {
        if (myGame.availableMoves.length != 0) {
            console.log(`Move ${i}: Player ${myGame.currentPlayer} moves from ${myGame.availableMoves[0]} by ${myGame.currentRoll} steps.`);
            myGame.performMove(myGame.availableMoves[0]);
        } else if (myGame.availableIntro) {
            console.log(`Move ${i}: Player ${myGame.currentPlayer} introduces a piece at ${myGame.currentRoll} steps.`);
            myGame.performIntro();
        } else {
            console.log(`Move ${i}: Player ${myGame.currentPlayer} cannot move with a roll of ${myGame.currentRoll} steps.`);
            myGame.abdicate();
        }
		renderBoard(myGame); // renders the board
		await sleep(1000); // puts a 1-second gap in between iterations
    }
	*/
	
	// this version updates when you press the iterate button (hopefully)

    if (myGame.winner != "n") console.log(`Game won by Player ${myGame.winner}.`);
    else console.log(`No winner.`);
    
    
    //return "Tests done!";
}

function iterateSomeMore() {
	if (myGame.availableMoves.length != 0) {
        console.log(`Move ${myGame.turnCount}: Player ${myGame.currentPlayer} moves from ${myGame.availableMoves[0]} by ${myGame.currentRoll} steps.`);
        myGame.performMove(myGame.availableMoves[0]);
    } else if (myGame.availableIntro) {
        console.log(`Move ${myGame.turnCount}: Player ${myGame.currentPlayer} introduces a piece at ${myGame.currentRoll} steps.`);
        myGame.performIntro();
    } else {
        console.log(`Move ${myGame.turnCount}: Player ${myGame.currentPlayer} cannot move with a roll of ${myGame.currentRoll} steps.`);
        myGame.abdicate();
    }
	renderBoard(myGame); // renders the board
}