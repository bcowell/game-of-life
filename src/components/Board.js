import React, { Component, createRef } from 'react';
import * as config from './config';
import _ from 'lodash';
import Cell from './Cell';

let canvas;
let context;

// util functions
const randomInt = max => Math.floor(Math.random() * Math.floor(max));
const roundToNearest = x => Math.floor(Math.ceil(x/config.cellWidth)*config.cellWidth, config.canvasWidth);


class Board extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = createRef();
        this.board = [];
        this.state = {
            tickSpeed: 300,
        }
    }

    componentDidMount() {
        this.createHTML5Canvas();
        // create the inital board state with a random seed
        this.createInitialBoardState();
        // start game loop
        window.requestAnimationFrame(this.gameTick);
    }

    createHTML5Canvas = () => {
        // draw context for canvas
        canvas = this.canvasRef.current;
        context = canvas.getContext('2d');
        context.fillStyle = config.boardBackgroundColour;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    gameTick = () => {
        this.update();
        this.draw();
        setTimeout(
            () => window.requestAnimationFrame(this.gameTick), 
            this.state.tickSpeed
        )
       
    }

    createInitialBoardState = () => {

        let numCells = randomInt(config.initialNumCells) + 1;
        // Create a board of a random number of live cells
        for (let i = 0; i < numCells; i++) {
            let rX = roundToNearest(randomInt(config.canvasWidth));
            let rY = roundToNearest(randomInt(config.canvasHeight));
            //console.log(rX, rY);
            this.board.push(new Cell(context, rX, rY, config.cellColour))
        }
    }

    clearBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    draw = () => {
        this.clearBoard();
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
                newBoard.push(new Cell(context, cell.x, cell.y, config.cellColour)); // add the cell from the board
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
                    deadBoard.push(new Cell(context, i, j, config.cellColour));
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

    render() {
        return (
            <canvas ref={this.canvasRef} className='canvas' width={config.canvasWidth} height={config.canvasHeight}></canvas>
        );
    }
}

export default Board;
