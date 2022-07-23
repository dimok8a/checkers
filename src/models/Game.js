class Game {
    constructor(parentComponent, whatTurnComponent) {
        this.board = new Board(parentComponent);
        this.firstPlayer = new Player(this.board.getGamerCheckers(0));
        this.secondPlayer = new Player(this.board.getGamerCheckers(1));
        this.currentPlayer = this.firstPlayer;
        this.whatTurnComponent = whatTurnComponent;
    }

    render() {
        this.board.render(this.firstPlayer.checkers.concat(this.secondPlayer.checkers));
        if (this.winner) {
            this.whatTurnComponent.innerHTML = `Победитель: ${this.winner.checkers[0].color === 'white'? 'белые' : 'черные'}`
            this.end();
            return;
        }
        this.whatTurnComponent.innerHTML = `Сейчас ходят: ${this.currentPlayer.checkers[0].color === 'white'? 'белые' : 'черные'}`
    }

    // Ищет шашку текущего пользователя
    findPlayerCheckerByCoords(x, y) {
        for (let i = 0; i<this.currentPlayer.checkers.length; i++)
            if (this.currentPlayer.checkers[i].cell.x === x && this.currentPlayer.checkers[i].cell.y === y)
                return this.currentPlayer.checkers[i]
    }

    findOtherPlayerCheckerByCoords(x, y) {
        let otherPlayer;
        if (this.currentPlayer === this.firstPlayer)
            otherPlayer = this.secondPlayer;
        else
            otherPlayer = this.firstPlayer;
        for (let i = 0; i<otherPlayer.checkers.length; i++)
            if (otherPlayer.checkers[i].cell.x === x && otherPlayer.checkers[i].cell.y === y)
                return otherPlayer.checkers[i]
    }

    // Ищет чью-нибудь шашку
    findCheckerByCoords(x, y) {
        for (let i = 0; i<this.firstPlayer.checkers.length; i++)
            if (this.firstPlayer.checkers[i].cell.x === x && this.firstPlayer.checkers[i].cell.y === y)
                return this.firstPlayer.checkers[i]
        for (let i = 0; i<this.secondPlayer.checkers.length; i++)
            if (this.secondPlayer.checkers[i].cell.x === x && this.secondPlayer.checkers[i].cell.y === y)
                return this.secondPlayer.checkers[i]
    }


    makeAvailableCells(selectedChecker) {
        const cell = selectedChecker.cell;
        if (selectedChecker.isQueen === true) {
            let [x, y] = [cell.x - 1, cell.y - 1];
            while (y >= 0 && x >= 0) {
                if (!this.findCheckerByCoords(x, y))
                    this.board.addAvailableCell(this.board.findCellByCoords(x, y))
                x -= 1;
                y -= 1;
            }
            [x, y] = [cell.x + 1, cell.y - 1];
            while (y >= 0 && x < this.board.cells.length) {
                if (!this.findCheckerByCoords(x, y))
                    this.board.addAvailableCell(this.board.findCellByCoords(x, y))
                x += 1;
                y -= 1;
            }
            [x, y] = [cell.x - 1, cell.y + 1];
            while (y < this.board.cells.length && x >= 0) {
                if (!this.findCheckerByCoords(x, y))
                    this.board.addAvailableCell(this.board.findCellByCoords(x, y))
                x -= 1;
                y += 1;
            }
            [x, y] = [cell.x + 1, cell.y + 1];
            while (y < this.board.cells.length && x < this.board.cells.length) {
                if (!this.findCheckerByCoords(x, y))
                    this.board.addAvailableCell(this.board.findCellByCoords(x, y))
                x += 1;
                y += 1;
            }
        } else {
            if (selectedChecker.color === "black") {
                if (cell.y - 1 >= 0) {
                    if (cell.x - 1 >= 0 ) {
                        if (!this.findCheckerByCoords(cell.x - 1, cell.y - 1)) {
                            this.board.addAvailableCell(this.board.findCellByCoords(cell.x - 1, cell.y - 1))
                        }
                    }
                    if (cell.x + 1 < this.board.cells.length)
                        if (!this.findCheckerByCoords(cell.x+1, cell.y-1))
                            this.board.addAvailableCell(this.board.findCellByCoords(cell.x+1, cell.y-1))            }
            } else {
                if (cell.y + 1 < this.board.cells.length) {
                    if (cell.x - 1 >= 0) {
                        if (!this.findCheckerByCoords(cell.x - 1, cell.y + 1)) {
                            this.board.addAvailableCell(this.board.findCellByCoords(cell.x - 1, cell.y + 1))
                        }
                    }
                    if (cell.x + 1 < this.board.cells.length)
                        if (!this.findCheckerByCoords(cell.x+1, cell.y+1))
                            this.board.addAvailableCell(this.board.findCellByCoords(cell.x+1, cell.y+1))
                }
            }
        }

    }

    isPossibleToChop(checker) {
        const cell = checker.cell;
        const obligatory = []
        if (checker.isQueen === true) {
            let [x, y] = [cell.x - 1, cell.y - 1];
            while (y >= 0 && x >= 0) {
                if (this.findCheckerByCoords(x, y)) {
                    let [tmpx, tmpy] = [x - 1, y - 1]
                    while (this.board.findCellByCoords(tmpx, tmpy)) {
                        obligatory.push(
                            {
                                cell: this.board.findCellByCoords(tmpx, tmpy),
                                checker: this.findOtherPlayerCheckerByCoords(x, y)
                            })
                        tmpx -= 1;
                        tmpy -= 1;
                    }
                }
                x -= 1;
                y -= 1;
            }
            [x, y] = [cell.x + 1, cell.y - 1];
            while (y >= 0 && x < this.board.cells.length) {
                if (this.findCheckerByCoords(x, y)) {
                    let [tmpx, tmpy] = [x + 1, y - 1]
                    while (this.board.findCellByCoords(tmpx, tmpy)) {
                        obligatory.push(
                            {
                                cell: this.board.findCellByCoords(tmpx, tmpy),
                                checker: this.findOtherPlayerCheckerByCoords(x, y)
                            })
                        tmpx += 1;
                        tmpy -= 1;
                    }
                }
                x += 1;
                y -= 1;
            }
            [x, y] = [cell.x - 1, cell.y + 1];
            while (y < this.board.cells.length && x >= 0) {
                if (this.findCheckerByCoords(x, y))
                {
                    let [tmpx, tmpy] = [x-1, y+1]
                    while (this.board.findCellByCoords(tmpx, tmpy)) {
                        obligatory.push(
                            {
                                cell: this.board.findCellByCoords(tmpx, tmpy),
                                checker: this.findOtherPlayerCheckerByCoords(x, y)
                            })
                        tmpx -= 1;
                        tmpy += 1;
                    }
                }
                x -= 1;
                y += 1;
            }
            [x, y] = [cell.x + 1, cell.y + 1];
            while (y < this.board.cells.length && x < this.board.cells.length) {
                if (this.findCheckerByCoords(x, y))
                {
                    let [tmpx, tmpy] = [x+1, y+1]
                    while (this.board.findCellByCoords(tmpx, tmpy)) {
                        obligatory.push(
                            {
                                cell: this.board.findCellByCoords(tmpx, tmpy),
                                checker: this.findOtherPlayerCheckerByCoords(x, y)
                            })
                        tmpx += 1;
                        tmpy += 1;
                    }
                }
                x += 1;
                y += 1;
            }
            return obligatory;
        }
        if (cell.y - 1 >= 0) {
            if (cell.x - 1 >= 0) {
                if (this.findOtherPlayerCheckerByCoords(cell.x - 1, cell.y - 1))
                    if (!this.findCheckerByCoords(cell.x - 2, cell.y - 2))
                        if (this.board.findCellByCoords(cell.x - 2, cell.y - 2)) {
                            obligatory.push(
                                {
                                    cell: this.board.findCellByCoords(cell.x - 2, cell.y - 2),
                                    checker: this.findOtherPlayerCheckerByCoords(cell.x - 1, cell.y - 1)
                                })
                }
            }
            if (cell.x + 1 < this.board.cells.length) {
                if (this.findOtherPlayerCheckerByCoords(cell.x + 1, cell.y - 1))
                    if (!this.findCheckerByCoords(cell.x + 2, cell.y - 2))
                        if (this.board.findCellByCoords(cell.x + 2, cell.y - 2)) {
                            obligatory.push(
                                {
                                    cell: this.board.findCellByCoords(cell.x + 2, cell.y - 2),
                                    checker: this.findOtherPlayerCheckerByCoords(cell.x + 1, cell.y - 1)
                                });
                        }
            }
        }
        if (cell.y + 1 < this.board.cells.length) {
            if (cell.x - 1 >= 0) {
                if (this.findOtherPlayerCheckerByCoords(cell.x - 1, cell.y + 1))
                    if (!this.findCheckerByCoords(cell.x - 2, cell.y + 2))
                        if (this.board.findCellByCoords(cell.x - 2, cell.y + 2)) {
                            obligatory.push( {
                                cell: this.board.findCellByCoords(cell.x - 2, cell.y + 2),
                                checker: this.findOtherPlayerCheckerByCoords(cell.x - 1, cell.y + 1)
                            });
                        }
            }
            if (cell.x + 1 < this.board.cells.length) {
                if (this.findOtherPlayerCheckerByCoords(cell.x + 1, cell.y + 1))
                    if (!this.findCheckerByCoords(cell.x + 2, cell.y + 2))
                        if (this.board.findCellByCoords(cell.x + 2, cell.y + 2)) {
                            obligatory.push({
                                cell: this.board.findCellByCoords(cell.x + 2, cell.y + 2),
                                checker: this.findOtherPlayerCheckerByCoords(cell.x + 1, cell.y + 1)
                            });
                        }
            }
        }
        return obligatory;
    }

    getObligatoryMoves() {
        const obligatoryMoves = [];
        for (let i = 0; i<this.currentPlayer.checkers.length; i++) {
            const obligatory = this.isPossibleToChop(this.currentPlayer.checkers[i]);
            if (obligatory.length > 0) {
                obligatoryMoves.push({
                    from: this.currentPlayer.checkers[i],
                    to: obligatory
                })
            }
        }
        return obligatoryMoves;
    }

    makeObligatoryCells(obligatoryCells) {
        for (let i = 0; i<obligatoryCells.length; i++)
            obligatoryCells[i].cell.available = true;
    }

    changePlayer() {
        this.board.clearAvailableCells();
        if (this.currentPlayer === this.firstPlayer) this.currentPlayer = this.secondPlayer
        else this.currentPlayer = this.firstPlayer;
        if (this.currentPlayer.checkers.length === 0)
            this.winner = this.currentPlayer === this.firstPlayer ? this.secondPlayer : this.firstPlayer
        this.obligatoryMoves = this.getObligatoryMoves();
    }

    deleteChecker(checker) {
        if (this.currentPlayer === this.firstPlayer) {
            this.secondPlayer.checkers = this.secondPlayer.checkers.filter(playerChecker => playerChecker !== checker);
        }
        else this.firstPlayer.checkers = this.firstPlayer.checkers.filter(playerChecker => playerChecker !== checker);
    }

    isObligatoryChecker(checker) {
        if (this.obligatoryMoves && this.obligatoryMoves.length > 0) {
            let hasObligatory = false;
            for (let i = 0; i<this.obligatoryMoves.length; i++) {
                if (this.obligatoryMoves[i].from === checker) {
                    this.makeObligatoryCells(this.obligatoryMoves[i].to);
                    hasObligatory = true;
                }
            }
            if (hasObligatory) {
                return true;
            }
        }
        return false;
    }

    hasObligatoryChecker() {
        return this.obligatoryMoves && this.obligatoryMoves.length > 0
    }

    makeCheckersQueen() {
        if (!this.currentPlayer.selectedChecker.isQueen) {
            if (this.currentPlayer === this.firstPlayer) {
                if (this.currentPlayer.selectedChecker.cell.y === this.board.cells.length - 1)
                    this.currentPlayer.selectedChecker.isQueen = true;
            } else {
                if (this.currentPlayer.selectedChecker.cell.y === 0) {
                    this.currentPlayer.selectedChecker.isQueen = true;
                }
            }
        }

    }

    // Выделение переданной шашки
    setCheckerSelected(selectedChecker) {
        this.currentPlayer.selectedChecker = selectedChecker;
        this.currentPlayer.selectedChecker.cell.selected = true;
    }

    // Удаление выделения шашки
    removeCheckerSelected(){
        this.currentPlayer.selectedChecker.cell.selected = false;
        this.currentPlayer.selectedChecker = null;
    }

    cutDown(cell) {
        let hasCutDown = false;
        if (this.obligatoryMoves  && this.obligatoryMoves.length > 0) {
            for (let i = 0; i<this.obligatoryMoves.length; i++) {
                if (this.obligatoryMoves[i].from === this.currentPlayer.selectedChecker) {
                    // Рубка шашки
                    for (let j = 0; j<this.obligatoryMoves[i].to.length; j++) {
                        if (this.obligatoryMoves[i].to[j].cell === cell) {
                            this.deleteChecker(this.obligatoryMoves[i].to[j].checker)
                            hasCutDown = true;
                        }
                    }
                }
            }
        }
        return hasCutDown;
    }

    onClick(x, y) {
        if (!this.currentPlayer.selectedChecker) {
            const selectedChecker = this.findPlayerCheckerByCoords(x, y);
            if (selectedChecker) {
                // Даем выделить только обязательные для хода шашки
                if (this.hasObligatoryChecker()) {
                    if (this.isObligatoryChecker(selectedChecker))
                        this.setCheckerSelected(selectedChecker);
                    return this.render();
                }
                this.makeAvailableCells(selectedChecker);
                // Даем выделить только шашку, которой можно сходить
                if (this.board.hasAvailableCells())
                    this.setCheckerSelected(selectedChecker);
            }
        } else {
            const selectedChecker = this.findPlayerCheckerByCoords(x, y);
            // Смена активной шашки
            if (selectedChecker) {
                this.removeCheckerSelected();
                this.board.clearAvailableCells();
                return this.onClick(x, y);
            }
            const cell = this.board.findCellByCoords(x, y);
            if (cell.available) {
                // Можно ли срубить
                const hasCutDown = this.cutDown(cell);
                this.currentPlayer.selectedChecker.cell.selected = false;
                this.currentPlayer.selectedChecker.cell = cell;
                // Если срубили шашку и можем срубить еще
                if (hasCutDown) {
                    if (this.isPossibleToChop(this.currentPlayer.selectedChecker).length > 0) {
                        this.obligatoryMoves = this.getObligatoryMoves();
                        return this.onClick(cell.x, cell.y);
                    }
                }
                // Проверяем, не вышла ли шашка в дамки
                this.makeCheckersQueen();
                this.currentPlayer.selectedChecker = null;
                this.changePlayer();
            }
        }
        this.render();
    }

    clickHandler(e) {
        if (e.target.dataset.x && e.target.dataset.y)
            this.onClick(parseInt(e.target.dataset.x), parseInt(e.target.dataset.y));
        else
            this.onClick(parseInt(e.target.parentNode.dataset.x), parseInt(e.target.parentNode.dataset.y));
    }

    start() {
        this.render();
        this.board.parentComponent.addEventListener('click', (e) => this.clickHandler(e));
    }

    end() {
        this.board.parentComponent.removeEventListener('click', this.clickHandler);
    }
}
