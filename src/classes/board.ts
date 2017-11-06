import { Tile } from "./tile";
import { Coord } from "./coord";

class Board {
  ctx: CanvasRenderingContext2D;
  timer: HTMLDivElement;
  flagCounter: HTMLDivElement;

  w: number;
  h: number;
  mines: number;
  tiles: Tile[][];

  lost: boolean;
  won: boolean;
  started: boolean;
  time: number;
  flagsPlaced: number;

  at(pos: Coord) {
    return this.tiles[pos.x][pos.y];
  }

  constructor(width: number, height: number, mines: number) {

    if (mines > width * height) mines = width * height;

    this.ctx = (<HTMLCanvasElement>document.getElementById("board")).getContext("2d");
    this.timer = <HTMLDivElement>document.getElementById("timer");
    this.flagCounter = <HTMLDivElement>document.getElementById("flagCounter");

    this.w = width;
    this.h = height;
    this.mines = mines;
    this.tiles = [];

    this.lost = false;
    this.won = false;
    this.started = false;
    this.time = 0;
    this.flagsPlaced = 0;

    this.flagCounter.innerText = this.mines.toString();
    this.timer.innerText = "0";
    this.ctx.canvas.width = this.w * 30;
    this.ctx.canvas.height = this.h * 30;

    for (let x = 0; x < width; x++) {
      this.tiles.push(new Array(height));
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.tiles[x][y] = new Tile(false, new Coord(x, y));
      }
    }

    for (let i = 0; i < mines; i++) {
      let x = Math.floor(Math.random() * this.w);
      let y = Math.floor(Math.random() * this.h);

      if (this.tiles[x][y].hasMine) i--;
      else {
        this.tiles[x][y].hasMine = true;
      }
    }

    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        this.tiles[x][y].calculateNeighbours(this);
      }
    }

    this.ctx.canvas.addEventListener("click", this.handleClick.bind(this));
    this.ctx.canvas.addEventListener("contextmenu", this.handleRightClick.bind(this));

    this.manageTimer();

    this.render();
  }

  manageTimer() {
    if (this.lost || this.won) return;
    if (this.started) {
      this.timer.innerText = this.time.toString();
      this.time++;
    }
    setTimeout(this.manageTimer.bind(this), 1000);
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "20px monospace";
    this.ctx.fillStyle = "lightgray";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        this.tiles[x][y].render(this.ctx);
      }
    }
  }

  handleClick(e: MouseEvent) {
    if (this.lost || this.won) return;
    let pos = new Coord(
      Math.floor((e.clientX - this.ctx.canvas.offsetLeft) / 30),
      Math.floor((e.clientY - this.ctx.canvas.offsetTop) / 30)
    );
    if (this.at(pos).isHidden) {
      this.at(pos).click(this);
      this.render();
    }
    this.checkWin();
  }

  handleRightClick(e: MouseEvent) {
    if (this.lost || this.won) return;
    let pos = new Coord(
      Math.floor((e.clientX - this.ctx.canvas.offsetLeft) / 30),
      Math.floor((e.clientY - this.ctx.canvas.offsetTop) / 30)
    );
    this.at(pos).rightClick(this);
    this.render();
    this.checkWin();
    e.preventDefault();
  }

  checkWin() {
    let tilesLeft = this.w * this.h - this.mines;
    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        if (!this.tiles[x][y].isHidden) {
          tilesLeft--;
        }
      }
    }
    if (tilesLeft === 0) {
      this.win();
    }
  }

  win() {
    this.won = true;
    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        this.tiles[x][y].isHidden = false;
      }
    }
    this.render();
  }

  loose() {
    this.lost = true;
    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        this.tiles[x][y].isHidden = false;
      }
    }
    this.render();
  }
}

export { Board };