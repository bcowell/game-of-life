class GameObject {
    constructor(context, x, y, colour) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.isColliding = false;
    }
}

export default GameObject;