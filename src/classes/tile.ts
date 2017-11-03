import { Board } from "./board";
import { Coord } from "./coord";

class Tile {
  hasMine: boolean;
  neighbours: number;
  pos: Coord;

  constructor(hasMine: boolean, pos: Coord) {
    this.hasMine = hasMine;
    this.pos = pos;
    this.neighbours = 0;
  }

  calculateNeighbours(board: Board) {
    [
      [-1, -1], [ 0, -1], [ 1, -1],
      [-1,  0],           [ 1,  0],
      [-1,  1], [ 0,  1], [ 1,  1]
    ].forEach(coord => {
      let checkPos = this.pos.plus(new Coord(coord[0], coord[1]));

      if (checkPos.x < 0 || checkPos.x > board.w - 1) return;
      if (checkPos.y < 0 || checkPos.y > board.h - 1) return;

      if (board.at(checkPos).hasMine) this.neighbours++;
    });
  }
}

export { Tile };