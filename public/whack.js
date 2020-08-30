/*
 * Name: Tyler Wong
 * Date: April 21, 2020
 * Section: CSE 154 AJ
 *
 * This is the JS to implement the UI for my whack a mole game. It generates
 * moles popping up in random places for a limited amount of time.
 */

"use strict";

/**
 * This is the self calling anonymous function that holds everything else.
 */
(function() {
  const MOLE_TIME = 1000;
  const GAME_LOOPS = 40;
  const START_MOLE_NUM = 8;
  window.addEventListener("load", init);

  /**
   * This funcion initialized the other functions once the page is loaded.
   */
  function init() {
    id("start").addEventListener("click", startGame);
  }

  /**
   * This function starts the game of whack a mole. It makes it so that a mole
   * pops up out of a random hole every MOLE_TIME seconds, GAME_LOOPS number
   * of times.
   */
  function startGame() {
    hideButtons();
    removeHoles();
    if (!(qs("input[type=radio]:checked").value === "START_MOLE_NUM")) {
      addHoles();
    }
    let count = 0;
    let runningGame = setInterval(function popup() {
      if (count === GAME_LOOPS) {
        endGame(runningGame);
      }
      count++;
      let randNum = Math.floor(Math.random() * parseInt(qs("input[type=radio]:checked").value));
      let con = qs("#container").children;
      let divider = con[randNum];
      let num = con[randNum].firstElementChild;
      divider.addEventListener("click", whackMole);
      num.src = "img/mole.png";
      num.alt = "Mole";
      hideAgain(divider);
    }, MOLE_TIME);
  }

  /**
   * This function stops moles from popping up and show the
   * start button and difficulty setting.
   * @param {intervalID} interval - ID of interval to make moles pop up
   */
  function endGame(interval) {
    window.clearInterval(interval);
    id("difficulty").classList.remove("hidden");
    id("start").classList.remove("hidden");
  }

  /**
   * This functions hides the start button and difficulty setting, and it
   * sets the score back to 0.
   */
  function hideButtons() {
    id("difficulty").classList.add("hidden");
    id("start").classList.add("hidden");
    id("score").textContent = "0";
  }

  /**
   * This function waits MOLE_TIME seconds, then makes the mole that is
   * currently selected disappear
   * @param {div} divider - the div that the current mole is in
   */
  function hideAgain(divider) {
    setTimeout(function hide() {
      if (divider.firstElementChild.alt === "Mole") {
        divider.removeEventListener("click", whackMole);
        divider.firstElementChild.src = "img/hole.png";
        divider.firstElementChild.alt = "Mole Hole";
      }
    }, MOLE_TIME);
  }

  /**
   * This function changes the image of a mole to a jumping mole for an
   * amount of time then changes the image to a hole with no mole.
   * @param {event} evnt - the current event, which is targeted at the mole just
   * clicked
   */
  function whackMole(evnt) {
    id("score").textContent++;
    let mole = evnt.currentTarget;
    mole.removeEventListener("click", whackMole);
    mole.firstElementChild.src = "img/jumpingmole.png";
    mole.firstElementChild.alt = "Jumping Mole";
    setTimeout(function changeBack() {
      mole.firstElementChild.src = "img/hole.png";
      mole.firstElementChild.alt = "Mole Hole";
    }, MOLE_TIME / 2);
  }

  /**
   * This function adds holes to give the amount of holes that the difficulty
   * input says. It makes it so the player will play the game with the amount
   * of mole holes they want.
   */
  function addHoles() {
    let amount = parseInt(qs("input[type=radio]:checked").value);
    for (let i = 0; i < amount - START_MOLE_NUM; i++) {
      let newDivider = gen("div");
      let image = gen("img");
      image.src = "img/hole.png";
      image.alt = "Mole Hole";
      id("container").appendChild(newDivider);
      newDivider.appendChild(image);
    }
  }

  /**
   * This function removes holes so that when starting the game there are not
   * too many holes that get added.
   */
  function removeHoles() {
    let holes = qs("#container").children;
    while (holes.length > START_MOLE_NUM) {
      holes[0].remove();
    }
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
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector string.
   * @returns {object} first element matching the selector in the DOM tree (null if none)
   */
  function qs(selector) {
    return document.querySelector(selector);
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

