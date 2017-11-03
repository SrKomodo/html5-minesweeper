import { Tile } from "./tile";
import { Coord } from "./coord";

class Board {
  tiles: Tile[][];
  w: number;
  h: number;
  mines: number;

  constructor(width: number, height: number, mines: number) {

    if (mines > width * height) mines = width * height;

    this.w = width;
    this.h = height;
    this.mines = mines;
    this.tiles = [];

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

    let thing = "";
    for (let x = 0; x < this.tiles.length; x++) {
      for (let y = 0; y < this.tiles[x].length; y++) {
        this.tiles[x][y].calculateNeighbours(this);
        thing += this.tiles[x][y].neighbours;
      }
      thing += "\n";
    }
    console.log(thing);
  }

  at(pos: Coord) {
    return this.tiles[pos.x][pos.y];
  }
}

export { Board };