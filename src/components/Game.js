import React, { Component, createRef } from 'react';
import * as config from './config';
import Board from './Board';

let canvas;
let context;
let board = [];

class Game extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = createRef();
        this.state = {
            tickSpeed: 300,
        }
    }

    componentDidMount() {
        this.createHTML5Canvas();
        board = new Board(context, canvas, []);
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
        board.update();
        board.draw();
        setTimeout(
            () => window.requestAnimationFrame(this.gameTick), 
            this.state.tickSpeed
        )
       
    }

    render() {
        return (
            <canvas ref={this.canvasRef} className='canvas' width={config.canvasWidth} height={config.canvasHeight}></canvas>
        );
    }
}

export default Game;
