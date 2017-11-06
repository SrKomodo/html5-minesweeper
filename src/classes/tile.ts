import { Board } from "./board";
import { Coord } from "./coord";

const tileImage = new Image(30, 30);
tileImage.src = "images/tile.png";

const mineImage = new Image(30, 30);
mineImage.src = "images/mine.png";

const flagImage = new Image(30, 30);
flagImage.src = "images/flag.png";

class Tile {
  isHidden: boolean;
  hasFlag: boolean;
  hasMine: boolean;
  boom: boolean;
  neighbours: number;
  pos: Coord;

  static get neighbours() {
    return [
      [-1, -1], [ 0, -1], [ 1, -1],
      [-1,  0],           [ 1,  0],
      [-1,  1], [ 0,  1], [ 1,  1]
    ]
  }

  static get colors() {
    return [
      "blue",
      "green",
      "red",
      "darkblue",
      "brown",
      "cyan",
      "black",
      "grey"
    ]
  }

  constructor(hasMine: boolean, pos: Coord) {
    this.boom = false;
    this.isHidden = true;
    this.hasFlag = false;
    this.hasMine = hasMine;
    this.pos = pos;
    this.neighbours = 0;
  }

  calculateNeighbours(board: Board) {
    Tile.neighbours.forEach(coord => {
      let checkPos = this.pos.plus(new Coord(coord[0], coord[1]));

      if (checkPos.x < 0 || checkPos.x > board.w - 1) return;
      if (checkPos.y < 0 || checkPos.y > board.h - 1) return;

      if (board.at(checkPos).hasMine) this.neighbours++;
    });
  }

  click(board: Board) {
    
    if (this.hasFlag) return;
    
    else if (this.neighbours > 0) {
      this.isHidden = false;
    }

    else if (this.hasMine) {
      this.boom = true;
      board.loose();
    }
    
    else if (this.isHidden) {
      this.isHidden = false;

      Tile.neighbours.forEach(coord => {
        let checkPos = this.pos.plus(new Coord(coord[0], coord[1]));
        
        if (checkPos.x < 0 || checkPos.x > board.w - 1) return;
        if (checkPos.y < 0 || checkPos.y > board.h - 1) return;
        
        board.at(checkPos).click(board);
      });
    }
  }

  rightClick(board: Board) {
    if (this.isHidden) {
      this.hasFlag = !this.hasFlag;
    }
    else {
      let flags = Tile.neighbours.reduce((prev, curr) => {
        let checkPos = this.pos.plus(new Coord(curr[0], curr[1]));

        if (checkPos.x < 0 || checkPos.x > board.w - 1) return prev;
        if (checkPos.y < 0 || checkPos.y > board.h - 1) return prev;

        return prev + (board.at(checkPos).hasFlag ? 1 : 0);
      }, 0);

      if (flags === this.neighbours) {
        Tile.neighbours.forEach(coord => {
          let checkPos = this.pos.plus(new Coord(coord[0], coord[1]));

          if (checkPos.x < 0 || checkPos.x > board.w - 1) return;
          if (checkPos.y < 0 || checkPos.y > board.h - 1) return;

          let tile = board.at(checkPos);
          if (tile.hasFlag) return;
          tile.click(board);
        });
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    let pos = new Coord(this.pos.x * 30, this.pos.y * 30);
    let center = new Coord(15, 15).plus(pos);

    if (this.isHidden) {
      ctx.drawImage(tileImage, pos.x, pos.y);
      if (this.hasFlag) {
        ctx.drawImage(flagImage, pos.x, pos.y);
      }
    }
    else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "darkgray";
      ctx.strokeRect(pos.x, pos.y, 30, 30);

      if (this.boom) {
        ctx.fillStyle = "red";
        ctx.fillRect(pos.x, pos.y, 30, 30);
      }

      if (this.hasMine) {
        ctx.drawImage(mineImage, pos.x, pos.y);
      }
      else if (this.neighbours > 0) {
        ctx.fillStyle = Tile.colors[this.neighbours - 1];
        ctx.fillText(this.neighbours.toString(), center.x, center.y + 2);
      }
    }
  }
}

export { Tile };