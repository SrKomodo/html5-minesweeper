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

export { Coord };