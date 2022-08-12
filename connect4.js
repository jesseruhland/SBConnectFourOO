class Player {
  constructor(color) {
    if (!color) {
      this.color = `rgb(${(Math.floor(Math.random()*256))}, ${(Math.floor(Math.random()*256))}, ${(Math.floor(Math.random()*256))})`;
    } else {
      this.color = color
    }
    this.pId = `${Math.floor(Math.random()*100)}`
  }
}

class Game {
  constructor(HEIGHT, WIDTH, p1, p2) {
    if(!HEIGHT || HEIGHT <= 0) {
      this.HEIGHT = 6
    } else {
      this.HEIGHT = HEIGHT;
    };
    if (!WIDTH || WIDTH <= 0) {
      this.WIDTH = 7
    } else {
      this.WIDTH = WIDTH;
    } this.board = new Array();
    this.players = new Array(p1, p2)
    this.currPlayer = this.players[0];
    this.gameOver = false
    this.makeBoard();
    this.makeHtmlBoard();
  }
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

  // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
    }

      board.append(row);
    }
    
  }
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer.pId}`);
    piece.style.backgroundColor = this.currPlayer.color
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    alert(msg);
    this.gameOver = true;
  }
  handleClick(evt) {
    if (this.gameOver) {
      alert ("No more moves to be played, the game is over! Click 'OK' to start a new game.", location.reload())
    }
    // get x from ID of clicked cell
    const x = +evt.target.id;
      
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.pId;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  checkForWin() {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer  
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.pId
      );

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  };
}

const newGame = (e) => {
  const board = document.getElementById('board');
  board.innerHTML='';
  const player1Color = document.querySelector('#player1').value;
  const player2Color = document.querySelector('#player2').value;
  const rows = document.querySelector('#rows').value;
  const columns = document.querySelector('#columns').value;
  const p1 = new Player(player1Color);
  const p2 = new Player(player2Color);
  new Game(rows,columns,p1, p2)
}

const startButton = document.querySelector('#startBtn')
startButton.addEventListener('click', newGame)

//