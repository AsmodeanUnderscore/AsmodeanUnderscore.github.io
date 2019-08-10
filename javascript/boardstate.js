/* File: boardstate.js
 * Author: AJFarmar August 2019
 */

// This class holds the board state, in other words what pieces are where.

// EXAMPLE: Setting up the board.
// > var myBoard = new BoardState();
// > myBoard.setContents("b1", "b")
// >        .setContents("o2", "o");
// > console.log(myBoard.contentsOf("b1")); // => "b"
// > console.log(myBoard.contentsOf("b2")); // => "n"

// EXAMPLE: Moving pieces on the board.
// > var result;
// > result = myBoard.performMove("b1", 3);
// > console.log(result); // => 1
// > result = myBoard.performMove("b4", 2);
// > console.log(result); // => 0
// > console.log(myBoard.contentsOf("m2")); // => "b"

// EXAMPLE: Introducing pieces to the board.
// > console.log(myBoard.introIsValid("o", 2)); // => false
// > result = myBoard.performIntro("o", 3);
// > console.log(result); // => 0
// > console.log(myBoard.contentsOf("o3")); // => "o"

// EXAMPLE: Fetching the positions of all pieces of a certain colour.
// > console.log(myBoard.findCoordsOf("b")); // => ["m2"]
// > console.log(myBoard.findCoordsOf("o")); // => ["o2","o3"]
// > myBoard.performMove("o3", 3);
// > console.log(myBoard.findCoordsOf("b")); // => []
// > console.log(myBoard.findCoordsOf("o")); // => ["o2","m2"]

// EXAMPLE: Finding all valid moves
// > var moves;
// > moves = myBoard.findValidMoves("o",2);
// > console.log(moves); // => ["o2","m2"]
// > moves = myBoard.findValidMoves("o",4);
// > console.log(moves); // => ["m2"]
// > moves = myBoard.findValidMoves("b",2);
// > console.log(moves); // => []

// EXAMPLE: Checking the number of available pieces.
// > var newBoard = new BoardState();
// > console.log(newBoard.oPot); // => 6
// > console.log(newBoard.oHome); // => 0
// > newBoard.performIntro("o", 4);
// > console.log(newBoard.oPot); // => 5
// > newBoard.performMove("o4", 4);
// > newBoard.performMove("m4", 4);
// > newBoard.performMove("m8", 3);
// > console.log(newBoard.oHome); // => 1

// EXAMPLE: Checking if someone has won. 
// > console.log(newBoard.winner()); // => "n"
// > newBoard.oHome = 7;
// > console.log(newBoard.winner()); // => "o"

class BoardState {
    
    // Initial board setup.
    constructor() {
        // We always begin with an empty board.
        this.oSide = Array(6).fill("n");
        this.mSide = Array(8).fill("n");
        this.bSide = Array(6).fill("n");
        
        // We describe the positions of the rosettes;
        this.rosettes = ["o4","b4","m4","o5","b5"];
        
        // The players start with all 7 of their pieces in their pots,
        // and none of their pieces home.
        this.totalPieces = 7;
        this.oPot = this.totalPieces; this.oHome = 0;
        this.bPot = this.totalPieces; this.bHome = 0;
        
        // We describe the paths that the pieces take.
        this.oPath = ["o1","o2","o3","o4","m1","m2","m3","m4","m5","m6","m7","m8","o5","o6"]; 
        this.bPath = ["b1","b2","b3","b4","m1","m2","m3","m4","m5","m6","m7","m8","b5","b6"];
    }
    
    
    // Fetches the side array that corresponds to a side name.
    fetchSideArray(name) {
        let sideArray;
        switch (name) {
            case "o": sideArray = this.oSide; break;
            case "m": sideArray = this.mSide; break;
            case "b": sideArray = this.bSide; break;
            default:
            throw new RangeError("The side coordinate must be one of \"o\", \"m\", or \"b\".");
        }
        return sideArray;
    }
    
    
    // Checks that a coordinate is valid
    verifyCoord(coord) {
        // Check that the coord is of length 2
        if (coord.length != 2) return false;
        
        let side = coord[0];
        let number = coord[1];
        switch (side) {
            case "o": case "b":
                if (!"123456".includes(number)) return false; break;
            case "m":
                if (!"12345678".includes(number)) return false; break;
            default:
                return false;
        }
        
        return true;
    }
    
    
    // Produces the contents of the cell at a coordinate.
    contentsOf(coord) {
        // Verify the coordinate
        if (!this.verifyCoord(coord)) throw new RangeError("Coordinate \"" + coord + "\" is invalid.");
        
        let side = coord[0];
        let number = parseInt(coord[1]) - 1;
        
        // Fetch the correct side array.
        let sideArray = this.fetchSideArray(side)
        return sideArray[number];
    }

    
    // Allows you to set the contents of the cell at a coordinate.
    setContents(coord, newContents) {
        // Verify the new contents
        if (!("nbo".includes(newContents) && newContents.length == 1)) { 
            throw new Error("Attempted to set invalid cell contents \"" + newContents + "\"");
        }
        
        // Verify the coordinate
        if (!this.verifyCoord(coord)) {
            throw new RangeError("Coordinate \"" + coord + "\" is invalid.");
        }
        
        let side = coord[0];
        let number = parseInt(coord[1]) - 1;
        
        // Fetch the correct side array, and modify it.
        this.fetchSideArray(side)[number] = newContents;
        
        // Return this object, for method chaining.
        return this;
    }
    
    
    // Checks if a coordinate has a rosette on it.
    isRosette(coord) {
        if (!this.verifyCoord(coord)) throw new RangeError("Coordinate \"" + coord + "\" is invalid.");
        return this.rosettes.includes(coord);
    }
    
    
    // Checks if the moving of a given piece is valid.
    // This doesn't account for the introduction of pieces.
    moveIsValid(coord, steps) {
        // We'll just throw an error if the coordinates or steps are invalid.
        if (!this.verifyCoord(coord)) throw new RangeError("Coordinate \"" + coord + "\" is invalid.");
        if (steps < 0 || steps > 4) throw new RangeError("Step count " + steps.toString() + " is invalid.");
        
        // We'll say that no move with inaction is valid.
        if (steps == 0) return false;
        
        // Get the colour of the player on that coordinate
        let player = this.contentsOf(coord);
        if (player == "n") throw new Error("Invalid move: the cell at coordinate \"" + coord + "\" is empty.");
        
        // Fetch the appropriate path, and the piece's position along that path.
        let path = {"o": this.oPath, "b": this.bPath}[player];
        let progress = path.indexOf(coord);
        
        // Throw an error if the piece isn't on the path; this is an incorrect state.
        if (progress == -1) throw new Error("Peice coloured \"" + player + "\" at position \"" + coord + "\" is not on its path.");
        
        // CONDITION 1: If the piece leaves the board exactly, the move is valid.
        if (progress + steps == path.length) return true;
        // CONDITION 2: If the piece leaves the board with too many steps, the move is invalid.
        if (progress + steps  > path.length) return false;
        // (since we now know the destination is on the board, let's get what it's landing on:)
        let endCoord = path[progress + steps];
        let destination = this.contentsOf(endCoord);
        // CONDITION 3: If the piece steps onto a friend, the move is invalid.
        if (destination == player) return false;
        // CONDITION 4: If the piece steps onto an enemy on a rosette, the move is invalid.
        if (destination != "n" && this.isRosette(endCoord)) return false;
        // All other moves are valid
        return true;
    }
    
    
    // Checks if the introduction of a given piece colour is valid.
    introIsValid(player, steps) {
        // We'll just throw an error if the coordinates, steps, or player are invalid.
        if (steps < 0 || steps > 4) throw new RangeError("Step count " + steps.toString() + " is invalid.");
        if (player != "o" && player != "b") throw new Error("Player \"" + player + "\" is invalid.");
        
        // If we've rolled 0, no intro is valid.
        if (steps == 0) return false;
        
        // If nothing is in the pot, no intro is valid.
        let pot = {"o": this.oPot, "b": this.bPot}[player];
        if (pot == 0) return false;
        
        // Fetch the appropriate path, and find whatever the piece will land on.
        let path = {"o": this.oPath, "b": this.bPath}[player];
        let destination = this.contentsOf(path[steps - 1]);
        
        // CONDITION 1: N/A.
        // CONDITION 2: N/A.
        // CONDITION 3: If the piece steps onto a friend, the move is invalid.
        if (destination == player) return false;
        // CONDITION 4: N/A.
        // All other moves are valid
        return true;
    }
    
    
    // Performs a move, and returns the move outcome:
    //   0 => End of turn.
    //   1 => Take another turn.
    // WARNING: THIS DOES NOT CHECK IF THE MOVE IS VALID. USE .performMove(...)!
    // This doesn't account for the introduction of pieces.
    checklessPerformMove(coord, steps) {
        let player = this.contentsOf(coord);
        let path = {"o": this.oPath, "b": this.bPath}[player];
        let progress = path.indexOf(coord);
        
        // We leave the coord we are currently on.
        this.setContents(coord, "n");
        
        // CASE 1: We have left the board.
        if (progress + steps == path.length) {
            switch (player) {
                case "o": this.oHome += 1; break;
                case "b": this.bHome += 1; break;
            }
            return 0;
        }
        
        // We now know we've landed on the board, so let's get that info:
        let endCoord = path[progress + steps];
        let destination = this.contentsOf(endCoord);
        // If we've taken the enemy, let's put their piece back in their pot:
        if (destination != "n" && destination != player) {
            switch (player) {
                case "o": this.bPot += 1; break;
                case "b": this.oPot += 1; break;
            }
        }
        // Move to the end coordinate:
        this.setContents(endCoord, player);
        
        // CASE 2: We have taken a rosette.
        if (this.isRosette(endCoord)) {
           return 1;
        }
        
        // CASE 3: Nothing of note has occured.
        return 0;
    }
    
    
    // Performs an introduction, and returns the move outcome:
    //   0 => End of turn.
    //   1 => Take another turn.
    // WARNING: THIS DOES NOT CHECK IF THE MOVE IS VALID. USE .performIntro(...)!
    checklessPerformIntro(player, steps) {
        let path = {"o": this.oPath, "b": this.bPath}[player];
        let endCoord = path[steps - 1];
        
        switch (player) {
            case "o": this.oPot -= 1;
            case "b": this.bPot -= 1;
        }
        this.setContents(endCoord, player)
        
        // CASE 1: We have taken a rosette.
        if (this.isRosette(endCoord)) {
            return 1;
        }
        
        // CASE 2: Nothing of note has occured
        return 0;
    }
    
    // Performs a move, and returns the move outcome:
    //   0 => End of turn.
    //   1 => Take another turn.
    // This doesn't account for the introduction of pieces.
    performMove(coord, steps) {
        // Throw an error if the move isn't valid.
        if (!this.moveIsValid(coord, steps))
            throw new Error("Attempted to perform invalid move from \"" + coord + "\" by " + steps.toString() + " steps.");
        return this.checklessPerformMove(coord, steps);
    }
    
    // Performs a introduction, and returns the move outcome:
    //   0 => End of turn.
    //   1 => Take another turn.
    performIntro(player, steps) {
        // Throw an error if the introduction isn't valid.
        if (!this.introIsValid(player, steps))
            throw new Error("Attempted to perform invalid intro of player \"" + player + "\" by " + steps.toString() + " steps.");
        return this.checklessPerformIntro(player, steps);
    }
    
    // Fetches the coordinates of all cells with the given contents.
    findCoordsOf(player) {
        if (player != "o" && player != "b" && player != "n") throw new Error("Player \"" + player + "\" is invalid.");
        
        let coords = ["o1","o2","o3","o4","o5","o6","m1","m2","m3","m4","m5","m6","m7","m8","b1","b2","b3","b4","b5","b6"];
        let positions = new Array();
        for (let coord of coords) {
            if (this.contentsOf(coord) == player) positions.push(coord);
        }
        return positions;
    }
    
    
    // Fetches the coordinates of all cells with a valid move,
    // given the player and the number of steps.
    findValidMoves(player, steps) {
        return this.findCoordsOf(player).filter((coord) => this.moveIsValid(coord, steps));
    }
    
    
    // Returns the winner of this board.
    // If there is no winner, returns "n".
    winner() {
        if (this.oHome == this.totalPieces) return "o";
        if (this.bHome == this.totalPieces) return "b";
        return "n";
    }
}



// This allows this file to be tested
function boardTests() {
    console.log(">>> Example 1");
    var myBoard = new BoardState();
    myBoard.setContents("b1", "b")
           .setContents("o2", "o");
    console.log(myBoard.contentsOf("b1") + " => b");
    console.log(myBoard.contentsOf("b2") + " => n"); 
    console.log(myBoard.contentsOf("o2") + " => o");
    
    console.log(">>> Example 2");
    var result;
    result = myBoard.performMove("b1", 3);
    console.log(result.toString() + " => 1");
    result = myBoard.performMove("b4", 2);
    console.log(result.toString() + " => 0");
    console.log(myBoard.contentsOf("m2") + " => b");
    console.log(myBoard.contentsOf("b4") + " => n");
    
    console.log(">>> Example 3");
    console.log(myBoard.introIsValid("o", 2).toString() + " => false");
    result = myBoard.performIntro("o", 3);
    console.log(result.toString() + " => 0");
    console.log(myBoard.contentsOf("o3") + " => o");
    
    console.log(">>> Example 4");
    console.log(myBoard.findCoordsOf("b").toString() + " => m2");
    console.log(myBoard.findCoordsOf("o").toString() + " => o2,o3");
    myBoard.performMove("o3", 3);
    console.log(myBoard.findCoordsOf("b").toString() + " => (empty)");
    console.log(myBoard.findCoordsOf("o").toString() + " => o2,m2");
    
    console.log(">>> Example 5");
    var moves;
    moves = myBoard.findValidMoves("o",2);
    console.log(moves.toString() + " => o2,m2");
    moves = myBoard.findValidMoves("o",4);
    console.log(moves.toString() + " => m2");
    moves = myBoard.findValidMoves("b",2);
    console.log(moves.toString() + " => (empty)");
    
    console.log(">>> Example 6");
    var newBoard = new BoardState();
    console.log(newBoard.oPot.toString() + " => 7");
    console.log(newBoard.oHome.toString() + " => 0");
    newBoard.performIntro("o", 4);
    console.log(newBoard.oPot.toString() + " => 6");
    newBoard.performMove("o4", 4);
    newBoard.performMove("m4", 4);
    newBoard.performMove("m8", 3);
    console.log(newBoard.oHome.toString() + " => 1");

    console.log(">>> Example 7");
    console.log(newBoard.winner() + " => n");
    newBoard.oHome = 7;
    console.log(newBoard.winner() + " => o");
    
    return "Tests done!";
}

