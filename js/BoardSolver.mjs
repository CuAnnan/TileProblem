import SearchTree from "./SearchTree.mjs";

const MAX_ITERATIONS = 100000;
const YIELD_INTERVAL = 100;


class BoardSolver
{
    #states;
    #visitedStates;
    #neighbourHoodTree;
    isSolved;
    board;

    constructor(board)
    {
        this.board = board;
        this.#states = [];
        this.#visitedStates = [];
        this.addBoard(board);
        this.#neighbourHoodTree = new SearchTree(board.toString(), board);
        this.isSolved = board.isSolved;
    }

    addBoard(board)
    {
        if(this.#visitedStates.includes(board.toString()))
        {
            return;
        }
        this.#states.push({board, weight:this.getHammingWeight(board)});
        this.#states.sort((a, b) => a.weight - b.weight);
        this.#visitedStates.push(board.toString());
    }

    getRoute()
    {
        if(!this.isSolved)
        {
            return [];
        }
        return this.#neighbourHoodTree.getPathFromRoot(this.board.solvedState);
    }

    greedyScan(depth=2)
    {
        let board = this.#states.shift().board;
        let neighbours = this.getBoardNeighbours(board, depth);
        for(let neighbour of neighbours)
        {
            if(neighbour.isSolved)
            {
                this.isSolved = true;
            }
            this.addBoard(neighbour);
        }
    }

    async solve(reportProgressCallback)
    {
        let iteration = 0;
        while(!this.isSolved && iteration < MAX_ITERATIONS)
        {
            for (let i = 0; i < YIELD_INTERVAL && !this.isSolved; i++)
            {
                this.greedyScan(2);
                iteration++;
            }

            // report progress to the callback function if provided
            if (reportProgressCallback)
            {
                reportProgressCallback({
                    iteration,
                    solved: this.isSolved,
                });
            }

            // Yield control back to the event loop to keep web worker responsive to more messages
            if (!this.isSolved && iteration < MAX_ITERATIONS) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }

        }
        return this.isSolved
            ? { solved: true, route: this.getRoute() }
            : { solved: false, route:[] };
    }

    /**
     * Returns an array of all the possible board states that can be reached from the given board state.
     * @param {Board} board - The current board state.
     * @param {number} depth - The depth of the search (not used in this implementation).
     * @returns {Board[]} An array of Board objects representing the neighboring states.
     */
    getBoardNeighbours(board, depth)
    {
        let neighbours = [];
        for(let direction of board.availableDirections)
        {
            let newBoard = board.getNeighbourByDirection(direction);
            if(!this.#visitedStates.includes(newBoard.toString()))
            {
                this.#neighbourHoodTree.addNode(board.toString(), newBoard.toString(), newBoard);
                neighbours.push(newBoard);
                if(depth > 1)
                {
                    let deeperNeighbours = this.getBoardNeighbours(newBoard, depth - 1);
                    neighbours.push(...deeperNeighbours);
                }
            }
        }
        return neighbours;
    }



    getHammingWeight(board)
    {
        let string = board.toString();
        let correct = board.solvedState;
        let weight = 0;

        for(let i = 0; i< string.length; i++)
        {
            if(string.charAt(i) !== " " && string.charAt(i) !== correct.charAt(i))
            {
                weight++;
            }
        }
        return weight;
    }

    getManhattanWeight(board)
    {
        let string = board.toString();
        let correct = board.solvedState;
        let weight = 0;

        for(let i = 0; i< string.length; i++)
        {
            if(string.charAt(i) !== " ")
            {
                let currentRow = Math.floor(i / board.size);
                let currentCol = i % board.size;
                let correctIndex = correct.indexOf(string.charAt(i));
                let correctRow = Math.floor(correctIndex / board.size);
                let correctCol = correctIndex % board.size;
                weight += Math.abs(currentRow - correctRow) + Math.abs(currentCol - correctCol);
            }
        }
        return weight;
    }
}

export default BoardSolver;