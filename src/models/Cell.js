class Cell {
    constructor(x = 0, y = 0, color = "white") {
        this.color = color;
        this.x = x;
        this.y = y;
        this.available = false;
        this.selected = false;
    }
}
