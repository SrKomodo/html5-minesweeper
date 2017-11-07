import { Board } from "./classes/board";

window.addEventListener("load", () => {
  const mine = <HTMLInputElement> document.getElementById("mines");
  const width = <HTMLInputElement> document.getElementById("width");
  const height = <HTMLInputElement> document.getElementById("height");
  
  let board = new Board(
    parseInt(width.value, 10),
    parseInt(height.value, 10),
    parseInt(mine.value, 10)
  );
  
  document.getElementById("reset").addEventListener("click", () => {
    board.lost = true;
    board = new Board(
      parseInt(width.value, 10),
      parseInt(height.value, 10),
      parseInt(mine.value, 10)
    );
  });
});