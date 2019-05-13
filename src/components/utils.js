import * as config from './config';

// util functions
export const randomInt = max => Math.floor(Math.random() * Math.floor(max));
export const roundToNearest = x => Math.floor(Math.ceil(x/config.cellWidth)*config.cellWidth, config.canvasWidth);