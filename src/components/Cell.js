import GameObject from './GameObject';
import * as config from './config';

class Cell extends GameObject {

    constructor(context, x, y, colour) {
        super(context, x, y, colour);
        // Set defaults
        this.width = config.cellWidth;
        this.height = config.cellHeight;
        this.colour = config.cellColour;
    }

    draw() {
        this.context.fillStyle = this.isColliding ? '#0099b0' : config.cellColour;
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Cell;