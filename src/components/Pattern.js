import * as config from './config';
import * as utils from './utils';
import Cell from './Cell';


class Pattern {

    constructor(pattern, context) {
        this.pattern = pattern;
        this.context = context;
        return this.random()
    }

    random() {
        let board = [];
        let numCells = utils.randomInt(config.initialNumCells) + 1;
        // Create a board of a random number of live cells
        for (let i = 0; i < numCells; i++) {
            let rX = utils.roundToNearest(utils.randomInt(config.canvasWidth));
            let rY = utils.roundToNearest(utils.randomInt(config.canvasHeight));
            //console.log(rX, rY);
            board.push(new Cell(this.context, rX, rY, config.cellColour))
        }
        return board;
    }
}

export default Pattern;