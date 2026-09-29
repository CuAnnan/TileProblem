import Board from './Board.mjs';
import BoardSolver from './BoardSolver.mjs';

const board = Board.bySize(4);
board.shuffle(10000);
console.log(board.show());

const boardSolver = new BoardSolver(board);

boardSolver.greedyScan(2);

const MAX_ITERATIONS = 100000;
let iteration = 0;
while(!boardSolver.isSolved && iteration < MAX_ITERATIONS)
{
    boardSolver.greedyScan(2);
    iteration++;
}

if(boardSolver.isSolved)
{
    console.log("Solved in " + iteration + " iterations");
    let route = boardSolver.getRoute();
    console.log("Route length: "+route.length);
    for(let state of route)
    {
        console.log(state.show());
    }
}
else
{
    console.log("Not solved in " + iteration + " iterations");
}