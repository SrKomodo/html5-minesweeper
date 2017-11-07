(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tile_1 = require("./tile");
var coord_1 = require("./coord");
var Board = /** @class */ (function () {
    function Board(width, height, mines) {
        if (mines > width * height)
            mines = Math.max(1, width * height - Math.max(width, height));
        this.ctx = document.getElementById("board").getContext("2d");
        this.timer = document.getElementById("timer");
        this.flagCounter = document.getElementById("flagCounter");
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
        for (var x = 0; x < width; x++) {
            this.tiles.push(new Array(height));
        }
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                this.tiles[x][y] = new tile_1.Tile(false, new coord_1.Coord(x, y));
            }
        }
        for (var i = 0; i < mines; i++) {
            var x = Math.floor(Math.random() * this.w);
            var y = Math.floor(Math.random() * this.h);
            if (this.tiles[x][y].hasMine)
                i--;
            else {
                this.tiles[x][y].hasMine = true;
            }
        }
        for (var x = 0; x < this.tiles.length; x++) {
            for (var y = 0; y < this.tiles[x].length; y++) {
                this.tiles[x][y].calculateNeighbours(this);
            }
        }
        this.ctx.canvas.addEventListener("click", this.handleClick.bind(this));
        this.ctx.canvas.addEventListener("contextmenu", this.handleRightClick.bind(this));
        this.manageTimer();
        this.render();
    }
    Board.prototype.at = function (pos) {
        return this.tiles[pos.x][pos.y];
    };
    Board.prototype.manageTimer = function () {
        if (this.lost || this.won)
            return;
        if (this.started) {
            this.timer.innerText = this.time.toString();
            this.time++;
        }
        setTimeout(this.manageTimer.bind(this), 1000);
    };
    Board.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "20px monospace";
        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var x = 0; x < this.tiles.length; x++) {
            for (var y = 0; y < this.tiles[x].length; y++) {
                this.tiles[x][y].render(this.ctx);
            }
        }
    };
    Board.prototype.handleClick = function (e) {
        if (this.lost || this.won)
            return;
        console.log(e.offsetX - this.ctx.canvas.clientLeft);
        var pos = new coord_1.Coord(Math.floor((e.offsetX - this.ctx.canvas.clientLeft) / 30), Math.floor((e.offsetY - this.ctx.canvas.clientTop) / 30));
        if (this.at(pos).isHidden) {
            this.at(pos).click(this);
            this.render();
        }
        this.checkWin();
    };
    Board.prototype.handleRightClick = function (e) {
        if (this.lost || this.won)
            return;
        var pos = new coord_1.Coord(Math.floor((e.offsetX - this.ctx.canvas.clientLeft) / 30), Math.floor((e.offsetY - this.ctx.canvas.clientTop) / 30));
        this.at(pos).rightClick(this);
        this.render();
        this.checkWin();
        e.preventDefault();
    };
    Board.prototype.checkWin = function () {
        var tilesLeft = this.w * this.h - this.mines;
        for (var x = 0; x < this.tiles.length; x++) {
            for (var y = 0; y < this.tiles[x].length; y++) {
                if (!this.tiles[x][y].isHidden) {
                    tilesLeft--;
                }
            }
        }
        if (tilesLeft === 0) {
            this.win();
        }
    };
    Board.prototype.win = function () {
        this.won = true;
        for (var x = 0; x < this.tiles.length; x++) {
            for (var y = 0; y < this.tiles[x].length; y++) {
                this.tiles[x][y].isHidden = false;
            }
        }
        this.render();
    };
    Board.prototype.loose = function () {
        this.lost = true;
        for (var x = 0; x < this.tiles.length; x++) {
            for (var y = 0; y < this.tiles[x].length; y++) {
                this.tiles[x][y].isHidden = false;
            }
        }
        this.render();
    };
    return Board;
}());
exports.Board = Board;

},{"./coord":2,"./tile":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Coord = /** @class */ (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    Coord.prototype.plus = function (coord) {
        return new Coord(this.x + coord.x, this.y + coord.y);
    };
    return Coord;
}());
exports.Coord = Coord;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coord_1 = require("./coord");
var tileImage = new Image(30, 30);
tileImage.src = "images/tile.png";
var mineImage = new Image(30, 30);
mineImage.src = "images/mine.png";
var flagImage = new Image(30, 30);
flagImage.src = "images/flag.png";
var Tile = /** @class */ (function () {
    function Tile(hasMine, pos) {
        this.boom = false;
        this.isHidden = true;
        this.hasFlag = false;
        this.hasMine = hasMine;
        this.pos = pos;
        this.neighbours = 0;
    }
    Object.defineProperty(Tile, "neighbours", {
        get: function () {
            return [
                [-1, -1], [0, -1], [1, -1],
                [-1, 0], [1, 0],
                [-1, 1], [0, 1], [1, 1]
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile, "colors", {
        get: function () {
            return [
                "blue",
                "green",
                "red",
                "darkblue",
                "brown",
                "cyan",
                "black",
                "grey"
            ];
        },
        enumerable: true,
        configurable: true
    });
    Tile.prototype.calculateNeighbours = function (board) {
        var _this = this;
        Tile.neighbours.forEach(function (coord) {
            var checkPos = _this.pos.plus(new coord_1.Coord(coord[0], coord[1]));
            if (checkPos.x < 0 || checkPos.x > board.w - 1)
                return;
            if (checkPos.y < 0 || checkPos.y > board.h - 1)
                return;
            if (board.at(checkPos).hasMine)
                _this.neighbours++;
        });
    };
    Tile.prototype.click = function (board) {
        var _this = this;
        board.started = true;
        if (this.hasFlag || !this.isHidden)
            return;
        this.isHidden = false;
        if (this.hasMine) {
            this.boom = true;
            board.loose();
            return;
        }
        if (this.neighbours === 0) {
            Tile.neighbours.forEach(function (coord) {
                var checkPos = _this.pos.plus(new coord_1.Coord(coord[0], coord[1]));
                if (checkPos.x < 0 || checkPos.x > board.w - 1)
                    return;
                if (checkPos.y < 0 || checkPos.y > board.h - 1)
                    return;
                board.at(checkPos).click(board);
            });
        }
    };
    Tile.prototype.rightClick = function (board) {
        var _this = this;
        board.started = true;
        if (this.isHidden) {
            this.hasFlag = !this.hasFlag;
            board.flagsPlaced += this.hasFlag ? 1 : -1;
            board.flagCounter.innerText = "" + (board.mines - board.flagsPlaced);
        }
        else {
            var flags = Tile.neighbours.reduce(function (prev, curr) {
                var checkPos = _this.pos.plus(new coord_1.Coord(curr[0], curr[1]));
                if (checkPos.x < 0 || checkPos.x > board.w - 1)
                    return prev;
                if (checkPos.y < 0 || checkPos.y > board.h - 1)
                    return prev;
                return prev + (board.at(checkPos).hasFlag ? 1 : 0);
            }, 0);
            if (flags === this.neighbours) {
                Tile.neighbours.forEach(function (coord) {
                    var checkPos = _this.pos.plus(new coord_1.Coord(coord[0], coord[1]));
                    if (checkPos.x < 0 || checkPos.x > board.w - 1)
                        return;
                    if (checkPos.y < 0 || checkPos.y > board.h - 1)
                        return;
                    var tile = board.at(checkPos);
                    if (tile.hasFlag)
                        return;
                    tile.click(board);
                });
            }
        }
    };
    Tile.prototype.render = function (ctx) {
        var pos = new coord_1.Coord(this.pos.x * 30, this.pos.y * 30);
        var center = new coord_1.Coord(15, 15).plus(pos);
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
    };
    return Tile;
}());
exports.Tile = Tile;

},{"./coord":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = require("./classes/board");
window.addEventListener("load", function () {
    var mine = document.getElementById("mines");
    var width = document.getElementById("width");
    var height = document.getElementById("height");
    var board = new board_1.Board(parseInt(width.value, 10), parseInt(height.value, 10), parseInt(mine.value, 10));
    document.getElementById("reset").addEventListener("click", function () {
        board.lost = true;
        board = new board_1.Board(parseInt(width.value, 10), parseInt(height.value, 10), parseInt(mine.value, 10));
    });
});

},{"./classes/board":1}]},{},[4]);
