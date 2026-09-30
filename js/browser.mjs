import Board from './Board.mjs';

(()=>{
    let board;
    let $board;
    let $solveButton;
    let $size;
    let $progress;
    let $heuristic;


    const solveWorker = new Worker('js/webworker.js', {
        type: 'module'
    });

    solveWorker.onmessage = (event) => {
        switch (event.data.action)
        {
            case "initialized":
                console.log("Solver initialized");
                break;
            case "progress":
                $progress.value += (`Iterations: ${event.data.iteration}\n`);
                $progress.scrollTop = $progress.scrollHeight;
                break;
            case "solve":
                if(event.data.solved)
                {
                    $progress.value += "Solved!\n";
                    animateRoute(event.data.route);
                }
                else
                {
                    $progress.value += "Not solved\n";
                    $board.classList.add("failed");
                }
                break;
            case "error":
                $progress.value += `Error: ${event.data.message}\n`;
                $solveButton.innerHTML="Solve Game";
                $solveButton.disabled = false;
                break;
        }
    };

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
        if(!board || board.isSolved)
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
            board = new Board(current.string, current.solvedState, current.size);
            drawBoard();
            setTimeout(()=>{
                animateRoute(route);
            }, 100);
        }
        else
        {
            $solveButton.innerHTML="Solve Game";
            $solveButton.disabled = false;
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
        solveWorker.postMessage({action:"solve"});
    }

    function newBoard()
    {
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
        solveWorker.postMessage({action:"init", board:{string:board.toString(), solvedState:board.solvedState, size:board.size}});
        $progress.value = "";
        $heuristic.removeAttribute("disabled");
        solveWorker.postMessage({action:"setHeuristic", heuristic:$heuristic.value});
    }

    document.addEventListener("DOMContentLoaded", ()=>{
        $board = document.getElementById("board");
        $solveButton = document.getElementById("solveButton");
        $solveButton.innerHTML="Solve Game";
        $solveButton.disabled = true;
        $size = document.getElementById("size");
        $progress = document.getElementById("progress");
        $heuristic = document.getElementById("heuristic");

        $heuristic.addEventListener("change", () => {
            if(board)
            {
                solveWorker.postMessage({action:"setHeuristic", heuristic:$heuristic.value});
            }
        });


        document.getElementById("runButton").addEventListener("click",  newBoard);

        $solveButton.addEventListener("click", solveBoard);

        document.addEventListener("keydown", handleKeyPress);
    });

})();