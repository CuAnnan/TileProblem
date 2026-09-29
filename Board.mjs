const alphabet="123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

class Board
{
    #cells;
    #blankCellPosition;
    solvedState;
    size;

    #directions = {
        up:{x:0, y:-1},
        down:{x:0, y:1},
        left:{x:-1, y:0},
        right:{x:1, y:0},
    }

    #oppositeDirections = {
        "up":"down",
        "down":"up",
        "left":"right",
        "right":"left",
    };

    get isSolved()
    {
        return this.toString() === this.solvedState;
    }

    show()
    {
        let string = "";
        for(let row of this.#cells)
        {
            string += row.join(" ")+"\n";
        }
        return string;
    }

    toString()
    {
        let string = "";
        for(let row of this.#cells)
        {
            string += row.join("");
        }
        return string;
    }

    /**
     * @param {String} string
     * @param {String} solvedState
     * @param {Number} size
     */
    constructor(string="12345678 ", solvedState = "12345678 ", size=3)
    {
        this.#cells = [];
        for(let i = 0; i < size; i++)
        {
            this.#cells.push([]);
        }
        let sizeSquared = size * size;
        for(let i = 0; i < sizeSquared; i++)
        {
            let row = Math.floor(i/size);
            let col = i%size;
            let char = string.charAt(i);
            this.#cells[row][col] = char;
            if(char === " ")
            {
                this.#blankCellPosition={x:col,y:row};
            }
        }
        this.solvedState = solvedState;
        this.size = size;
    }

    static bySize(size)
    {
        let string = "";
        let sizeSquared = size * size;
        for (let i = 1; i < sizeSquared; i++) {
            string += alphabet.charAt(i - 1);
        }
        string += " ";
        console.log(`String: "${string}"`);
        return new Board(string, string, size);
    }

    getNeighbourByDirection(direction)
    {
        let neighbour = new Board(this.toString(), this.solvedState, this.size);
        neighbour.moveBlank(direction);
        return neighbour;
    }

    moveBlank(direction)
    {
        let directionCoords = this.#directions[direction];
        if(this.canMoveBlank(direction))
        {
            let targetCellCoords = {
                x:this.#blankCellPosition.x + directionCoords.x,
                y:this.#blankCellPosition.y + directionCoords.y
            }
            let targetCell = this.getCellAtCoords(targetCellCoords);
            this.setCellAtCoords(targetCellCoords, " ");
            this.setCellAtCoords(this.#blankCellPosition, targetCell);
            this.#blankCellPosition = targetCellCoords;
        }
    }

    shuffleArray(toShuffle)
    {
        let shuffled = [...toShuffle];
        for (let i = shuffled.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }


    moveBlankRandomly()
    {
        let randomDirection = this.shuffleArray(this.availableDirections)[0];
        this.moveBlank(randomDirection);
    }

    shuffle(times=100)
    {
        for(let i = 0; i < times; i++)
        {
            this.moveBlankRandomly();
        }
    }

    getCellAtCoords(coords)
    {
        return this.#cells[coords.y][coords.x];
    }

    setCellAtCoords(coords, value)
    {
        this.#cells[coords.y][coords.x] = value;
    }

    get availableDirections()
    {
        const directions = [];
        for(let direction in this.#directions)
        {
            if(this.canMoveBlank(direction))
            {
                directions.push(direction);
            }
        }
        return directions;
    }

    canMoveBlank(direction)
    {
        if(!this.#directions[direction])
        {
            throw new Error("Direction out of bounds");
        }
        let directionCoords = this.#directions[direction];

        return (
            this.#blankCellPosition.x + directionCoords.x >=0 &&
            this.#blankCellPosition.y + directionCoords.y >=0 &&
            this.#blankCellPosition.x + directionCoords.x < this.size &&
            this.#blankCellPosition.y + directionCoords.y < this.size
        );
    }
}

export default Board;