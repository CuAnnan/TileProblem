import SearchTree from "./SearchTree.mjs";

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
        this.#states.push({board, weight:this.getBoardWeight(board)});
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



    getBoardWeight(board)
    {
        let string = board.toString();
        let correct = board.solvedState;
        let weight = 0;

        for(let i = 0; i< string.length; i++)
        {
            if(string.charAt(i) !== correct.charAt(i))
            {
                weight++;
            }
        }
        return weight;
    }
}

export default BoardSolver;