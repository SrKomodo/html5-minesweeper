import { Tile } from "./tile";
import { Coord } from "./coord";

class Board {
  tiles: Tile[][];
  w: number;
  h: number;
  mines: number;
  ctx: CanvasRenderingContext2D;
  lost: boolean;
  won: boolean;

  at(pos: Coord) {
    return this.tiles[pos.x][pos.y];
  }

  constructor(width: number, height: number, mines: number, ctx: CanvasRenderingContext2D) {

    if (mines > width * height) mines = width * height;

    this.lost = false;
    this.won = false;
    this.ctx = ctx;
    this.w = width;
    this.h = height;
    this.mines = mines;
    this.tiles = [];

    this.ctx.canvas.width = this.w * 30;
    this.ctx.canvas.height = this.h * 30;

    for (let x = 0; x < width; x++) {
      let row = [];
      for (let y = 0; y < height; y++) {
        let tile = new Tile(false, new Coord(x, y));
        row.push(tile);
      }
      this.tiles.push(row);
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

    this.render();
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