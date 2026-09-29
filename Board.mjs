class Board
{
    #cells;
    #blankCellPosition;
    #initialised;
    #directions = {
        up:{x:0, y:-1},
        down:{x:0, y:1},
        left:{x:-1, y:0},
        right:{x:1, y:0},
    }
    #correctCells="12345678 ";

    #oppositeDirections = {
        "up":"down",
        "down":"up",
        "left":"right",
        "right":"left",
    };

    toString()
    {
        let string = "";
        for(let row of this.#cells)
        {
            string += row.join("");
        }
        return string;
    }

    constructor(string=this.#correctCells)
    {
        const cells = string.split("");
        this.#cells = [[],[],[]];
        for(let i = 0; i < 9; i++)
        {
            let row = Math.floor(i/3);
            let col = i%3;
            let char = string.charAt(i);
            this.#cells[row][col] = char;
            if(char === " ")
            {
                this.#blankCellPosition={x:col,y:row};
            }
        }

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

    moveBlankRandomly()
    {
        let direction = this.availableDirections.sort((a,b) => Math.);
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
            this.#blankCellPosition.x + directionCoords.x <=2 &&
            this.#blankCellPosition.y + directionCoords.y <=2
        );
    }
}

export default Board;