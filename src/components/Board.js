import React, { Component, createRef } from 'react';

const canvasWidth = 300;
const canvasHeight = 300;

const randomInt = max => Math.floor(Math.random() * Math.floor(max));

class Board extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = createRef();
    }

    componentDidMount() {
        // draw context for canvas
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = '#282c34';
        context.fillRect(0, 0, canvas.width, canvas.height);
        // start game timer
        this.gameTimer = setInterval(this.gameTick, 1000);
        // create the inital board state with a random seed
        this.createInitialBoardState();
    }

    componentWillUnmount() {
        clearInterval(this.gameTimer);
    }

    createInitialBoardState = () => {
        // number of points to begin - between 1 and 100
        let numCells = randomInt(99) + 1;
        for (let i = 0; i < numCells; i++) {
            let rX = randomInt(canvasWidth);
            let rY = randomInt(canvasHeight);
            this.drawCell(rX, rY);
            console.log(rX, rY);
        }
    }

    drawCell = (rX, rY) => {

        const cellWidth = 5;
        const cellHeight = 5;
        const cellColour = 'red';

        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = cellColour;
        context.fillRect(rX, rY, cellWidth, cellHeight);
    }

    gameTick = () => {
       console.log('tick');
    }

    render() {
        return (
            <canvas ref={this.canvasRef} className='canvas' width={canvasWidth} height={canvasHeight}></canvas>
        );
    }
}

export default Board;
