import { Board } from "./classes/board";

window.addEventListener("load", () => {
  let canvas = document.getElementById("board") as HTMLCanvasElement;
  let ctx = canvas.getContext("2d");

  let board = new Board(9, 9, 10, ctx);
  
  document.getElementById("reset").addEventListener("click", () => {
    board = new Board(9, 9, 10, ctx);
  });
});