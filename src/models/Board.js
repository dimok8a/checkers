class Board {
    constructor(parentComponent) {
        this.parentComponent = parentComponent;
        this.cells = [[]];
        this.selectedChecker = null;
        this.availableCells = [];
        this.fillCells();
    }
    
    fillCells() {
        this.cells.pop();
        for (let i = 0; i < 8; i++) {
            this.cells.push([]);
            for (let j = 0; j<8; j++) {
                if ((i + j) % 2 === 1)
                    this.cells[i].push(new Cell(j, i, "white"))
                else
                    this.cells[i].push(new Cell(j, i, "black"))
            }
        }
    }


    getGamerCheckers(whatGamer=0) {
        const returnArray = [];
        if (whatGamer === 0) {
            for (let i = 0; i < 3; i++)
                for (let j = i % 2; j < 8; j += 2)
                    returnArray.push(new Checker(this.cells[i][j]));
        } else {
            for (let i = 5; i<8; i++)
                for (let j = i%2; j<8; j+=2)
                    returnArray.push(new Checker(this.cells[i][j], "black"));
        }
        return returnArray;
    }

    draw(checkers) {
        // Создаем клеточки
        for (let i = 0; i<this.cells.length; i++) {
            for (let j = 0; j<this.cells[i].length; j++) {
                const cell = this.cells[i][j];
                const newCell = document.createElement('div')
                newCell.classList.add('cell');
                if (cell.selected)
                    newCell.classList.add('selected')
                else {
                    newCell.classList.add(cell.color);
                    if (cell.available)
                        newCell.classList.add('available');
                }
                newCell.setAttribute('data-x', cell.x);
                newCell.setAttribute('data-y', cell.y);
                this.parentComponent.appendChild(newCell);
            }
        }
        // Создаем фигуры
        const children = this.parentComponent.children;
        for (let i = 0; i < checkers.length; i++) {
            const checker = checkers[i];
            const checkerElement = document.createElement('img');
            if (checker.color === 'white')
                if (checker.isQueen === true)
                    checkerElement.src = 'src/images/white-queen.png';
                else
                    checkerElement.src = 'src/images/white.png';
            else
                if (checker.isQueen === true)
                    checkerElement.src = 'src/images/black-queen.png';
                else
                    checkerElement.src = 'src/images/black.png';
            const cell = checker.cell;
            children[cell.y * 8 + cell.x].appendChild(checkerElement);
        }
    }

    render(checkers) {
        this.parentComponent.innerHTML = "";
        this.draw(checkers);
    }


    findCellByCoords(x, y) {
        if (x >= 0 && y >= 0 && x < this.cells.length && y < this.cells.length)
            return this.cells[y][x];
    }

    addAvailableCell(cell) {
        this.availableCells.push(cell)
        cell.available = true;
    }

    hasAvailableCells() {
        return this.availableCells.length > 0;
    }

    clearAvailableCells() {
        for (let i = 0; i<this.cells.length; i++)
            for (let j = 0; j<this.cells[i].length; j++)
                this.cells[i][j].available = false;
        this.availableCells = [];
    }

}
