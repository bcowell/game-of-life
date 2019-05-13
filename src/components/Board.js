import * as config from './config';
import { roundToNearest } from './utils';
import _ from 'lodash';
import Cell from './Cell';
import Pattern from './Pattern';


class Board {

    constructor(context, canvas, board, pattern) {
        this.context = context;
        this.canvas = canvas;
        this.board = board;
        this.createInitialBoardState(pattern);
    }

    createInitialBoardState = (pattern) => {
        this.board = new Pattern(pattern, this.context);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw = () => {
        this.clear();
        this.board.forEach(cell => cell.draw())
    }

    update = () => {
        this.board = this.advanceGeneration();
        // if at any point the board has a mass extinction
        if (this.board.length === 0) {
            this.createInitialBoardState(); // re init board
        }
    }

    advanceGeneration = () => {

        // Reset collision state of all cells
        let newBoard = this.board.map(cell => {
            cell.isColliding = false
            return cell
        });

        // Check all live cells
        this.board.forEach((cell,i) => {
            let liveNeighbours = this.detectCollisions(cell.x, cell.y);
            // death by underpopulation or overpopulation
            if (liveNeighbours < 2 || liveNeighbours > 3) {
                newBoard.splice(i,1); // remove the cell from the board
            }
        })

        // Check all dead cells
        // Create a deadBoard for all points not contained in the board
        let deadBoard = this.createDeadBoard();
        
        deadBoard.forEach(cell => {
            let liveNeighbours = this.detectCollisions(cell.x, cell.y);
            // reproduction
            if (liveNeighbours === 3) {
                newBoard.push(new Cell(this.context, cell.x, cell.y, config.cellColour)); // add the cell from the board
            }
        })

        return newBoard;
    }

    createDeadBoard = () => {
        let deadBoard = [];

        for (let i = 0; i < config.canvasWidth; i = i + config.cellWidth) {
            for (let j = 0; j < config.canvasHeight; j = j + config.cellHeight) {
                // can't find the cell in the board, it is dead
                if (!this.board.find(cell => cell.x === i && cell.y === j)) {
                    deadBoard.push(new Cell(this.context, i, j, config.cellColour));
                }
            }
        }
        return deadBoard;
    }

    // Returns the number of live cells in the eight neighbours of a given x,y
    detectCollisions = (x,y) => {

        // the distance from the center of the current cell to the edge of the neighbouring cells
        const neighboursEdgeX = roundToNearest(config.cellWidth + config.cellWidth/2);
        const neighboursEdgeY = roundToNearest(config.cellHeight + config.cellHeight/2);
        // Make sure we don't check outside the bounds of the canvas
        // Smallest distance a cell's center can be from the edge of the canvas is half the cell's dimension
        const startX = Math.max(config.cellWidth/2, x - neighboursEdgeX);
        const endX = Math.min(config.canvasWidth - config.cellWidth/2, x + neighboursEdgeX);
        const startY = Math.max(config.cellHeight/2, y - neighboursEdgeY);
        const endY = Math.min(config.canvasHeight - config.cellHeight/2, y + neighboursEdgeY);

        // Filter board for cells in the surrounding area
        let searchResults = _.filter(this.board, cell => 
            // Don't include the cell itself
            (cell.x !== x || cell.y !== y) &&
            // Cell is contained between the startX and startY area
            (startX <= cell.x && cell.x <= endX) &&
            (startY <= cell.y && cell.y <= endY)
        )

        if (searchResults && searchResults.length > 0) {
            searchResults.forEach(cell => cell.isColliding = true)
        }
        return searchResults.length;
    }

}

export default Board;