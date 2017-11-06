import { Board } from "./classes/board";

window.addEventListener("load", () => {
  let board = new Board(9, 9, 10);
  
  document.getElementById("reset").addEventListener("click", () => {
    board = new Board(9, 9, 10);
  });
});