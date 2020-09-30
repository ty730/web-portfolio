/*
 * Name: Tyler Wong
 * Date: August 26, 2020
 *
 * This is the JS to implement
 */

"use strict";

/**
 * This is the self calling anonymous function that holds everything else.
 */
(function() {
  let player = true;
  let ai = false;
  let board = [["b", "e", "b", "e","b", "e", "b", "e"],
            ["e", "b", "e","b", "e", "b", "e", "b"],
            ["b", "e", "b", "e","b", "e", "b", "e"],
            ["e", "e", "e", "e", "e", "e", "e", "e"],
            ["e", "e", "e", "e", "e", "e", "e", "e"],
            ["e", "r", "e","r", "e", "r", "e", "r"],
            ["r", "e", "r", "e","r", "e", "r", "e"],
            ["e", "r", "e","r", "e", "r", "e", "r"]];

  window.addEventListener("load", init);

  /**
   * This function initialized the functions for making requests when buttons are
   * clicked or submitted.
   */
  function init() {
    id("one").addEventListener("click", one);
    id("two").addEventListener("click", two);
    let pieces = qsa(".red");
    for (let i = 0; i < pieces.length; i++) {
      pieces[i].addEventListener("click", red);
    }
    let opponentPieces = qsa(".black");
    for (let j = 0; j < pieces.length; j++) {
      opponentPieces[j].addEventListener("click", black);
    }
    genGraphics(board);
  }

  /*

  Start of one player checkers with AI

  */

  function one() {
    id("login").classList.add("hidden");
    id("board").classList.remove("hidden");
    ai = true;
  }

  function two() {
    id("login").classList.add("hidden");
    id("board").classList.remove("hidden");
  }

  function algorithm() {
    if (false) {
      console.log("game over");
    } else {
      let acts = actions(board, player);
      for (let k = 0; k < acts.length; k++) {
        if (acts.length > 2 && board[acts[k][2] + 1] && board[acts[k][2] + 1][acts[k][3] + 1] == "r" &&
            acts[k][3] - 1 == acts[k][1]) { //right
          acts.splice(k, 1);
          k--;
        }
        else if (acts.length > 2 && board[acts[k][2] + 1] && board[acts[k][2] + 1][acts[k][3] - 1] == "r" &&
            acts[k][3] + 1 == acts[k][1]) { //left
          acts.splice(k, 1);
          k--;
        }
      }
      let move = acts.length - 1;
      for (let i = 0; i < acts.length; i++) {
        if (acts[i][4]) {
          move = i;
        }
      }
      if (acts[move][4] == "king" || acts[move][5] == "king") {
        board = result(board, acts[move], "bk");
      } else {
        board = result(board, acts[move], "b");
      }
      genGraphics(board);
    }
    player = !player;
  }

  function terminal(board) {
    //let blackActs = actions(board, false);
    //let redActs = actions(board, true)
    /*if (blackActs.length == 0) {
      console.log("red wins");
      return "red";
    } else if (redActs.length == 0) {
      console.log("black wins");
      return "black";
    } else {
      return "none";
    } */
    return 1;
  }

  function actions(board, player) {
    let opponent;
    let y;
    if (!player) {
      player = "b";
      opponent = "r";
      y = 1;
    } else {
      player = "r";
      opponent = "b";
      y = -1
    }
    let acts = [];
    acts = checkActions(board, player, opponent, y, acts);
    acts = checkActions(board, player + "k",  opponent, -y, acts);
    acts = checkActions(board, player + "k",  opponent, y, acts);
    console.log(acts);
    return acts;
  }

  function checkActions(board, player, opponent, y, acts) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] == player) {
          if (board[i + y] && board[i + y][j + 1] == "e") { //right
            console.log("(" + (i + y) + ", " + (j + 1) + ")");
            if (player.substring(1) == "k") {
              acts.push([i, j, i + y, j + 1, "king"]);
            } else {
              acts.push([i, j, i + y, j + 1]);
            }
          } else if (board[i + y] && board[i + y][j + 1] == opponent) {
            if (board[i + (2 * y)] && board[i + (2 * y)][j + 2] == "e") {
              console.log("jump: (" + (i + (2 * y)) + ", " + (j + 2) + ")");
              if (player.substring(1) == "k") {
                acts.push([i, j, i + (2 * y), j + 2, "jump", "king"]);
              } else {
                acts.push([i, j, i + (2 * y), j + 2, "jump"]);
              }
            }
          }
          if (board[i + y] && board[i + y][j - 1] == "e") { //left
            console.log("(" + (i + y) + ", " + (j - 1) + ")");
            if (player.substring(1) == "k") {
              acts.push([i, j, i + y, j - 1, "king"]);
            } else {
              acts.push([i, j, i + y, j - 1]);
            }
          } else if (board[i + y] && board[i + y][j - 1] == opponent) {
            if (board[i + (2 * y)] && board[i + (2 * y)][j - 2] == "e") {
              console.log("jump: (" + (i + (2 * y)) + ", " + (j - 2) + ")");
              if (player.substring(1) == "k") {
                acts.push([i, j, i + (2 * y), j - 2, "jump", "king"]);
              } else {
                acts.push([i, j, i + (2 * y), j - 2, "jump"]);
              }
            }
          }
        }
      }
    }
    return acts;
  }

  function result(board, action, color) {
    board[action[0]][action[1]] = "e";
    if (action[2] == 7 && color == "b") {
      board[action[2]][action[3]] = color + "k";
    } else {
      board[action[2]][action[3]] = color;
    }
    if (Math.abs(action[2] - action[0]) == 2) {
      board[((action[2] + action[0]) / 2)][((action[1] + action[3]) / 2)] = "e";
    }
    return board;
  }

  function genGraphics(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] == "b") {
          if (id((i + 1) + "" + (j + 1)).innerHTML == "") {
            let piece = gen("div");
            piece.classList.add("black");
            id((i + 1) + "" + (j + 1)).appendChild(piece);
            piece.addEventListener("click", black);
          }
        } else if (board[i][j] == "r") {
          if (id((i + 1) + "" + (j + 1)).innerHTML == "") {
            let piece = gen("div");
            piece.classList.add("red");
            id((i + 1) + "" + (j + 1)).appendChild(piece);
            piece.addEventListener("click", red);
          }
        } else if (board[i][j] == "rk") {
          if (id((i + 1) + "" + (j + 1)).innerHTML == "") {
            let piece = gen("div");
            piece.classList.add("red");
            piece.classList.add("king");
            id((i + 1) + "" + (j + 1)).appendChild(piece);
            let crown = gen("img");
            crown.src = "img/crown.png";
            piece.appendChild(crown);
            piece.addEventListener("click", red);
          }
        } else if (board[i][j] == "bk") {
          if (id((i + 1) + "" + (j + 1)).innerHTML == "") {
            let piece = gen("div");
            piece.classList.add("black");
            piece.classList.add("king");
            id((i + 1) + "" + (j + 1)).appendChild(piece);
            let crown = gen("img");
            crown.src = "img/crown.png";
            piece.appendChild(crown);
            piece.addEventListener("click", black);
          }
        } else if (board[i][j] == "e") {
          if (id((i + 1) + "" + (j + 1)).innerHTML !== "") {
            id((i + 1) + "" + (j + 1)).innerHTML = "";
          }
        }
      }
    }
  }


  /*

  Start of two player checkers without AI

  */



  /**
   * This function requests
   * @param {event} evnt - event of submitting the submit button
   * @returns {Boolean} True if there is a possible jump, false otherwise.
   */
  function moveOption(evnt, red) {
    let jump = false;
    if (player == red) {
    //deselect all previously possible squares
    removePossibles();
    //deselect previously selected square
    removeSelected();
    //select current possible squares
    let currSquare;
    if (evnt.target) {
      if (evnt.target.parentElement.classList.contains("king")) {
        currSquare = evnt.target.parentElement.parentElement;
      } else {
        currSquare = evnt.target.parentElement;
      }
    } else {
      currSquare = evnt;
    }
    currSquare.classList.add("selected");
    let currId = currSquare.id;
    let upLeftId = parseInt(currId.substring(0,1)) - 1 + "" + parseInt(currId.substring(1)) - 1;
    let upRightId = parseInt(currId.substring(0,1)) - 1 + "" + (parseInt(currId.substring(1)) + 1);
    let downLeftId =  parseInt(currId.substring(0,1)) + 1 + "" + parseInt(currId.substring(1)) - 1;
    let downRightId = parseInt(currId.substring(0,1)) + 1 + "" + (parseInt(currId.substring(1)) + 1);
    if (!red) {
      let temp = upLeftId;
      let tem = upRightId;
      upLeftId = downLeftId;
      upRightId = downRightId;
      downLeftId = temp;
      downRightId = tem;
    }
    let upLeft = id(upLeftId);
    let upRight = id(upRightId);
    let leftJump = createPossible(upLeft, true, red, red);
    let rightJump = createPossible(upRight, false, red, red);
    if (currSquare.childNodes[0].classList.contains("king")) {
      let downLeft = id(downLeftId);
      let downRight = id(downRightId);
      let dLeftJump = createPossible(downLeft, true, !red, red);
      let dRightJump = createPossible(downRight, false, !red, red);
      jump = leftJump || rightJump || dLeftJump || dRightJump;
    } else {
      jump = leftJump || rightJump;
    }
    }
    return jump;
  }

  /**
   * Moves selected piece
   * @param {event} evnt - element ID
   * @param {Boolean} jump - If player is jumping another piece then true, false otherwise
   */
  function movePiece(evnt, jump) {
    let doubleRed = true;
    if (player == "double") {
      let select = qsa(".selected")[0].childNodes[0].classList.contains("black");
      if (select) {
        doubleRed = false;
      }
    }
    let piece = gen("div");
    let before = qsa(".selected");
    let befId = before[0].id;
    let aftId = evnt.target.id;
    if (jump) {
      let opponentId = (parseInt(befId.substring(0,1)) -
                       ((parseInt(befId.substring(0,1)) - parseInt(aftId.substring(0,1))) / 2)) + "" +
                       (parseInt(befId.substring(1)) -
                       ((parseInt(befId.substring(1)) - parseInt(aftId.substring(1))) / 2));
      id(opponentId).innerHTML = "";
    }
    let selected = qsa(".selected");
    let possibleKing = ""
    if (selected[0].childNodes[0].classList.contains("king")) {
      //let crown = gen("img");
      //crown.src = "img/crown.png";
      //piece.appendChild(crown);
      //piece.classList.add("king");
      possibleKing = "k";
    }
    selected[0].innerHTML = "";
    if (player && doubleRed) {
      //piece.classList.add("red");
      //piece.addEventListener("click", red);
      //evnt.target.appendChild(piece);
      board = result(board, [befId.substring(0,1) - 1, befId.substring(1) - 1, aftId.substring(0,1) - 1, aftId.substring(1) - 1], "r" + possibleKing);
      genGraphics(board);
    } else {
      board = result(board, [befId.substring(0,1) - 1, befId.substring(1) - 1, aftId.substring(0,1) - 1, aftId.substring(1) - 1], "b" + possibleKing);
      genGraphics(board);
    }
    removePossibles();
    removeSelected();
    checkDoubleJump(evnt.target, jump, doubleRed);
    checkKing(evnt.target);
    if (player !== "double" && ai) {
      algorithm();
    }
  }

  /**
   * Checks if the piece should become a king
   */
  function checkKing(square) {
    if (((!player && Math.floor(square.id / 10) == 1) ||
        (player && Math.floor(square.id / 10) == 8))
        && !square.childNodes[0].classList.contains("king")) {
      let crown = gen("img");
      crown.src = "img/crown.png";
      square.childNodes[0].appendChild(crown);
      square.childNodes[0].classList.add("king");
    }
  }

  /**
   * Checks if the piece can double jump
   */
  function checkDoubleJump(square, jump, doubleRed) {
    if (jump) {
      let p = player;
      if (!doubleRed) {
        p = false;
      }
      let doubleJump = moveOption(square, p);
      if (doubleJump) {
        let possibles = qsa(".possible");
        for (let i = 0; i < possibles.length; i++) {
          if (Math.abs((possibles[i].id - square.id) % 2) === 1) {
            possibles[i].classList.remove("possible");
            possibles[i].removeEventListener("click", noJump);
            possibles[i].removeEventListener("click", yesJump);
          }
        }
        player = "double";
      } else {
        removePossibles();
        removeSelected();
        if (player === "double" && !doubleRed) {
          player = true;
        } else {
          player = !player;
        }
      }
    } else {
      player = !player;
    }
  }

  /**
   * Removes possible squares for a piece to move
   */
  function removeSelected() {
    let selected = qsa(".selected");
    for (let j = 0; j < selected.length; j++) {
      selected[j].classList.remove("selected");
    }
  }

  /**
   * Removes selected square
   */
  function removePossibles() {
    let possibles = qsa(".possible");
    for (let i = 0; i < possibles.length; i++) {
      possibles[i].classList.remove("possible");
      possibles[i].removeEventListener("click", noJump);
      possibles[i].removeEventListener("click", yesJump);
    }
  }

  /**
   * Checks if a possible move is valid
   * @param {DOM Element} square - square on the board
   * @param {Boolean} left - true if on left side, false if on right
   * @param {Boolean} red - true if piece is red, false if piece is black
   * @returns {Boolean} True if there is a possible jump, false otherwise.
   */
  function createPossible(square, left, red, enemy) {
    let jump = false;
    let opponent;
    if (enemy) {
      opponent = "black";
    } else {
      opponent = "red";
    }
    if (square) {
      let squareId = square.id;
      if (square.innerHTML == "") {
        square.classList.add("possible");
        square.addEventListener("click", noJump);
      } else if (square.childNodes[0].classList.contains(opponent)) {
        let upUpSquare;
        let firstDigit;
        if (red) {
          firstDigit = parseInt(squareId.substring(0,1)) - 1;
        } else {
          firstDigit = parseInt(squareId.substring(0,1)) + 1;
        }
        if (left) {
          upUpSquare = id(firstDigit + "" + parseInt(squareId.substring(1)) - 1);
        } else {
          upUpSquare = id(firstDigit + "" + (parseInt(squareId.substring(1)) + 1));
        }
        if (upUpSquare && upUpSquare.innerHTML == "") {
          upUpSquare.classList.add("possible");
          upUpSquare.addEventListener("click", yesJump);
          jump = true;
        }
      }
    }
    return jump;
  }

  /**
   * Checks if the game is over
   */
  function terminal() {
  }

  /**
   * Anonymous function for passing arguments to event listeners
   * @param {event} e - event
   */
  let noJump = function(e) {
    movePiece(e, false);
  }

  /**
   * Anonymous function for passing arguments to event listeners
   * @param {event} e - event
   */
  let yesJump = function(e) {
    movePiece(e, true);
  }

  /**
   * Anonymous function for passing arguments to event listeners
   * @param {event} e - event
   */
  let red = function(e) {
    moveOption(e, true);
  }

  /**
   * Anonymous function for passing arguments to event listeners
   * @param {event} e - event
   */
  let black = function(e) {
    moveOption(e, false);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if none).
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query (empty if none).
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns the new element of given type
   * @param {string} elType - an elements type
   * @returns {element} new element of the given type.
   */
  function gen(elType) {
    return document.createElement(elType);
  }
})();