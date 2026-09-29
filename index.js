import Board from './Board.mjs';

const board = new Board();

console.log(`"${board.toString()}"`);
console.log(board.availableDirections);
board.moveBlank(board.availableDirections[0]);
console.log(board.availableDirections);
console.log(`"${board.toString()}"`);