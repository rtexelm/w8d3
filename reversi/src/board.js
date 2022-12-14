// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];
  for (let i = 0; i < 8; i++) {
    grid.push(new Array(8));
  }
  grid[3][3] = new Piece('white');
  grid[4][4] = new Piece('white');
  grid[3][4] = new Piece('black');
  grid[4][3] = new Piece('black');
  return grid;
};

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
};

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  return [0, 1, 2, 3, 4, 5, 6, 7].includes(pos[0]) && [0, 1, 2, 3, 4, 5, 6, 7].includes(pos[1])
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  // if (this.isValidPos(pos) === false) { return false };
  if (this.isValidPos(pos) === false) { throw new Error('Not valid pos!') };
  return this.grid[pos[0]][pos[1]];
};


Board.prototype.getPiece2 = function (pos) {
  if (this.isValidPos(pos) === false) { return false };
  // if (this.isValidPos(pos) === false) { throw new Error('Not valid pos!') };
  return this.grid[pos[0]][pos[1]];
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  return (this.getPiece2(pos) ? this.getPiece2(pos).color === color : undefined);
  // return (this.grid[pos[0]][pos[1]].color === color)
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return (this.getPiece2(pos) != undefined);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  let x1 = pos[0]; let y1 = pos[1]; let dirX = dir[0]; let dirY = dir[1];

  if (!this.isValidPos(pos)) { return []};
  if (!this.isOccupied([x1 + dirX, y1 + dirY])) {return []};
  // if (this.getPiece([x1 + dirX, y1 + dirY]).color === color) {return []};
  let pieces = []; 
  // while (true) {
  //   x1 += dirX; y1 += dirY; 
  //   // debugger
  //   if (!this.isValidPos([x1, y1])) {return []};
  //   let piece = this.getPiece2([x1, y1]); 
  //   if ( piece === undefined) {return []};
  //   if (piece.color === color ) { return pieces}
  //   else (pieces.push([x1, y1]));
  //   // return pieces
  // }
  piecesToFlip = piecesToFlip || [];
  pos = [x1 + dirX, y1 + dirY];
  if(this.getPiece2(pos).color != color) {piecesToFlip.push(pos)} else {return piecesToFlip};
  return this._positionsToFlip(pos,color,dir,piecesToFlip);

};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if(this.isOccupied(pos)) {return false};
  let dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
  for(let i = 0; i < dirs.length; i++) {
    if (this._positionsToFlip(pos, color, dirs[i], []).length != 0) {return true};
  };
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  // if (this.isValidPos(pos) === false) { throw new Error('Invalid move!')};

  if (this.validMove(pos,color) === false) { throw new Error('Invalid move!') };
  this.grid[pos[0]][pos[1]] = new Piece(color);
  let dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
  let piecesToFlip = [];
  for(let i = 0; i < dirs.length; i++) {
    piecesToFlip = piecesToFlip.concat(this._positionsToFlip(pos,color,dirs[i],[]));
  };
  for(let i = 0; i < piecesToFlip.length; i++) {
    let position = piecesToFlip[i];
    // let piece = this.getPiece(position);
    this.grid[position[0]][position[1]].flip();
  };
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validMovesArray = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j <8 ; j++) {
      if (this.validMove([i,j], color)) {
        validMovesArray.push([i,j])
      }
    }
  }
  return validMovesArray
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !this.hasMove('white') && !this.hasMove('black');
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log(this.grid);
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE