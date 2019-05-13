import React, { Component, createRef } from 'react';
import * as config from './config';
import Board from './Board';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

let canvas;
let context;
let board;

class Game extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = createRef();
        this.state = {
            tickSpeed: 300,
            gameLoopRunning: true,
            pattern: 'random',
        }
    }

    componentDidMount() {
        this.createHTML5Canvas();
        board = new Board(context, canvas, this.state.pattern);
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
        if (this.state.gameLoopRunning) {
            setTimeout(
                () => window.requestAnimationFrame(this.gameTick),
                this.state.tickSpeed
            )
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    tickSpeedHandleChange = event => {
        this.setState({ tickSpeed: event.target.value })
    }

    render() {
        return (
            <Grid container spacing={18}>
                <Grid item xs>
                    <FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.gameLoopRunning}
                                        onChange={this.handleChange('gameLoopRunning')}
                                        value="gameLoopRunning"
                                        color="primary"
                                    />
                                }
                                label="Run"
                            />
                            <p>Game speed in ms <input value={this.state.tickSpeed} onChange={this.tickSpeedHandleChange} type="number" style={{ width: "50px" }} /></p>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.pattern === 'random'}
                                        onChange={this.handleChange('pattern')}
                                        value="random"
                                        color="primary"
                                    />
                                }
                                label="Random"
                            />
                            <Button variant="contained" color="primary">Start</Button>
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid item xs>
                    <canvas ref={this.canvasRef} className='canvas' width={config.canvasWidth} height={config.canvasHeight}></canvas>
                </Grid>
            </Grid>
        );
    }
}

export default Game;
