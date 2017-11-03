class Coord {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  plus(coord: Coord) {
    return new Coord(this.x + coord.x, this.y + coord.y);
  }
}

class Board {
  tiles: Tile[][];
  w: number;
  h: number;

  constructor(width: number, height: number) {
    this.w = width;
    this.h = height;
    let tiles: Tile[][] = [];

    for (let x = 0; x < width; x++) {
      let row = [];
      for (let y = 0; y < height; y++) {
        let tile = new Tile(false, new Coord(x, y));
        row.push(tile);
      }
      tiles.push(row);
    }

    this.tiles = tiles;
    this.tiles[1][1].hasMine = true;
    
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
      [-1, -1], [0, -1], [ 1, -1],
      [-1,  0],          [ 1,  0],
      [-1,  1], [0,  1], [ 1,  1]
    ].forEach(coord => {
      let checkPos = this.pos.plus(new Coord(coord[0], coord[1]));

      if (checkPos.x < 0 || checkPos.x > board.w - 1) return;
      if (checkPos.y < 0 || checkPos.y > board.h - 1) return;

      if (board.at(checkPos).hasMine) this.neighbours++;
    });
  }
}

let board = new Board(4, 4);