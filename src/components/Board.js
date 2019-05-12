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
        this.timestamp = null;
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

    gameTick = timestamp => {

        this.update();
        this.draw();

        //for testing purpose limit the max amount of game loops
        // config.loop = config.loop + 1;
        // if(config.loop >= config.maxLoop) { return }
        
        //window.requestAnimationFrame(this.gameTick);
    }

    createInitialBoardState = () => {

        let numCells = randomInt(config.initialNumCells) + 1;

        for (let i = 0; i < numCells; i++) {
            let rX = randomInt(config.canvasWidth);
            let rY = randomInt(config.canvasHeight);
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
        this.detectCollisions();
    }

    detectCollisions = () => {
        // Reset collision state of all cells
        this.board.forEach(cell => cell.isColliding = false);
        // Check all cells for cells in the surrounding area
        this.board.forEach(cell => {
            let liveNeighbours = this.countLiveNeighbourCells(cell.x, cell.y);
        })
    }

    // Returns the number of live cells in the eight neighbours of a given x,y
    countLiveNeighbourCells = (x,y) => {

        let liveNeighbours = 0

        // Make sure we don't check outside the bounds of the canvas
        const startX = Math.max(0, x - config.cellWidth);
        const endX = Math.min(config.canvasWidth, x + config.cellWidth);
        const startY = Math.max(0, y - config.cellHeight);
        const endY = Math.min(config.canvasHeight, y + config.cellHeight);

        console.log(`x: ${x}`)
        console.log(`y: ${y}`)
        console.log(`startX: ${startX}`)
        console.log(`endX: ${endX}`)
        console.log(`startY: ${startY}`)
        console.log(`endY: ${endY}`)


        let searchResults = _.filter(this.board, obj => 
            // Don't include the cell itself
            (obj.x !== x && obj.y !== y) &&
            (startX <= obj.x && obj.x <= endX) &&
            (startY <= obj.y && obj.y <= endY)
        )
        console.log(searchResults)
        if (searchResults) {
            searchResults.forEach(cell => cell.isColliding = true)
        }
        return liveNeighbours;
    }

    render() {
        return (
            <canvas ref={this.canvasRef} className='canvas' width={config.canvasWidth} height={config.canvasHeight}></canvas>
        );
    }
}

export default Board;
