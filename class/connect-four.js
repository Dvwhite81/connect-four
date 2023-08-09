const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

    constructor() {

        this.playerTurn = "O";

        this.grid = [
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ']
        ]

        this.cursor = new Cursor(6, 7);

        // Initialize a 6x7 connect-four grid
        Screen.initialize(6, 7);
        Screen.setGridlines(true);

        Screen.addCommand('left', 'left command', this.cursor.left.bind(this.cursor));
        Screen.addCommand('right', 'right command', this.cursor.right.bind(this.cursor));
        Screen.addCommand('return', 'make mark command', this.makeMark.bind(this));

        this.cursor.setBackgroundColor();
        Screen.render();
    }

    findFirstOpen(column) {
        for (let i = 5; i >= 0; i--) {
            if (this.grid[i][column] === ' ') return i;
        }
    }

    makeMark() {
        let player = this.playerTurn;
        let c = this.cursor.col;

        if (this.findFirstOpen(c) === undefined) {
            Screen.setMessage(`Column Full, Try Again`);
            Screen.render();
        } else {
            let r = this.findFirstOpen(c);
            this.grid[r][c] = player;
            Screen.setGrid(r, c, player);
            if (player === 'O') {
                Screen.setBackgroundColor(r, c, 'red');
            }
            else {
                Screen.setBackgroundColor(r, c, 'blue');
            }

            if (ConnectFour.checkWin(this.grid)) ConnectFour.endGame(player);

            if (player === 'O') this.playerTurn = 'X';
            else if (player === 'X') this.playerTurn = 'O';
            Screen.render();
        }
    }
    
    static containsSub(master, sub) {
        return master.join(',').includes(sub.join(','));
    }

    static checkWin(grid) {
        let winner = false;
        let empties = [];
        let vertical = [];

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                if (grid[i][j] === ' ') empties.push(grid[i][j]);

                // Horizontal
                if (grid[i].join(',').includes(['X', 'X', 'X', 'X'].join(','))) winner = 'X';
                if (grid[i].join(',').includes(['O', 'O', 'O', 'O'].join(','))) winner = 'O';
            }
        }
        // Tie
        if (empties.length === 0) winner = 'T';

        // Vertical
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 6; j++) {
                vertical.push(grid[j][i]);
            }
            if (vertical.join(',').includes(['X', 'X', 'X', 'X'].join(','))) winner = 'X';
            if (vertical.join(',').includes(['O', 'O', 'O', 'O'].join(','))) winner = 'O';
            vertical = [];
        }
        
        // Diagonal Up
        for (let i = 3; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                let one = grid[i][j];
                if (one !== ' ') {
                    let two = grid[i - 1][j + 1];
                    let three = grid[i - 2][j + 2];
                    let four = grid[i - 3][j + 3];
                    if (one === two && one === three && one === four) winner = one;
                }
            }
        }

        // Diagonal Down
        for (let j = 0; j < 7; j++) {
            for (let i = 0; i < 3; i++) {
                let one = grid[i][j];
                if (one !== ' ') {
                    let two = grid[i + 1][j + 1];
                    let three = grid[i + 2][j + 2];
                    let four = grid[i + 3][j + 3];
                    if (one === two && one === three && one === four) winner = one;
                }
            }
        }

        return winner;
    }

    static endGame(winner) {
        if (winner === 'O' || winner === 'X') {
            Screen.setMessage(`Player ${winner} wins!`);
        } else if (winner === 'T') {
            Screen.setMessage(`Tie game!`);
        } else {
            Screen.setMessage(`Game Over`);
        }
        Screen.render();
        Screen.quit();
    }

}

module.exports = ConnectFour;