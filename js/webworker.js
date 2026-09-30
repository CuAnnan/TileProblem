import Board from "./Board.mjs";
import BoardSolver from "./BoardSolver.mjs";

let board;
let boardSolver;

self.onmessage = (event) => {
    switch(event.data.action)
    {
        case "init":
            let boardData = event.data.board;
            board = new Board(boardData.string, boardData.solvedState, boardData.size);
            boardSolver = new BoardSolver(board);
            postMessage({action:"initialized"});
            break;
        case "setHeuristic":
            if(!boardSolver) {
                postMessage({
                    action: "error",
                    message: "Solver has not been initialized"
                });
                break;
            }
            boardSolver.setHeuristic(event.data.heuristic);
            break;
        case "solve":
            if (!boardSolver) {
                postMessage({
                    action: "error",
                    message: "Solver has not been initialized"
                });
                break;
            }

            boardSolver.solve(progress=>{
                postMessage({
                    action: "progress",
                    ...progress
                });
            })
                .then((result)=>{
                    postMessage({
                        action:"solve",
                        solved:result.solved,
                        route:result.route
                    });
                })
                .catch(error=>{
                    postMessage({
                        action:"error",
                        message:error.message
                    });
                });
            break;
    }
};