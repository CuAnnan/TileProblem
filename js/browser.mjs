import Board from './Board.mjs';
import BoardSolver from './BoardSolver.mjs';

(()=>{
    let board;
    let $board;
    let $solveButton;
    const MAX_ITERATIONS = 100000;
    let currentIteration = 0;

    function drawBoard()
    {
        $board.innerHTML = "";
        if(board.isSolved)
        {
            $board.classList.add("solved");
            $solveButton.setAttribute("disabled", "disabled");
        }
        for(let row of board.cells)
        {
            const $row = document.createElement("div");
            $row.classList.add("puzzle-row");
            for(let cell of row)
            {
                const $cell = document.createElement("div");
                $cell.classList.add("tile");
                $cell.classList.add("col");
                if(cell === " ")
                {
                    $cell.classList.add("blank");
                    $cell.innerHTML = "&nbsp;";
                }
                else
                {
                    $cell.textContent = cell;
                }
                $row.appendChild($cell);
            }
            $board.appendChild($row);
        }
    }

    function handleKeyPress(event)
    {
        if(board.isSolved)
        {
            return;
        }


        switch(event.key)
        {
            case "ArrowUp": case "w": case "W":
                event.preventDefault();
                board.moveBlank("up");
                drawBoard();
                break;
            case "ArrowDown": case "s": case "S":
                event.preventDefault();
                board.moveBlank("down");
                drawBoard();
                break;
            case "ArrowLeft": case "a": case "A":
                event.preventDefault();
                board.moveBlank("left");
                drawBoard();
                break;
            case "ArrowRight": case "d": case "D":
                event.preventDefault();
                board.moveBlank("right");
                drawBoard();
                break;
        }

    }

    function animateRoute(route)
    {
        let current = route.shift();
        if(current)
        {
            board = current;
            drawBoard();
            setTimeout(()=>{
                animateRoute(route);
            }, 100);
        }
    }

    function solveBoard()
    {
        if(!board || board.isSolved)
        {
            return;
        }
        $solveButton.innerHTML="Solving...";
        $solveButton.disabled = true;

        setTimeout(()=>{
            const boardSolver = new BoardSolver(board);
            currentIteration = 0;
            while(currentIteration < MAX_ITERATIONS && !boardSolver.isSolved)
            {
                console.log(currentIteration);
                boardSolver.greedyScan(2);
                currentIteration++;
            }
            if(boardSolver.isSolved)
            {
                let route = boardSolver.getRoute();
                animateRoute(route);
            }
            else
            {
                $board.classList.add("failed");
            }
        },0);
    }

    document.addEventListener("DOMContentLoaded", ()=>{
        $board = document.getElementById("board");
        $solveButton = document.getElementById("solveButton");

        const $size = document.getElementById("size");
        document.getElementById("runButton").addEventListener("click", ()=>{
            $board.classList.remove("solved");
            $board.classList.remove("failed");
            const size = Number($size.value);
            if(size === 0) {
                return;
            }
            board = Board.bySize(size);
            board.shuffle(1000);
            drawBoard();
            $solveButton.removeAttribute("disabled");
        });

        $solveButton.addEventListener("click", solveBoard);

        document.addEventListener("keydown", handleKeyPress);
    });

})();