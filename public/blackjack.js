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
  let cardsPlayed = [];
  let username;

  window.addEventListener("load", init);

  /**
   * This function initialized the functions for making requests when buttons are
   * clicked or submitted.
   */
  function init() {
    id("login-form").addEventListener("submit", playGame);
    id("ten").addEventListener("click", bet);
    id("fifty").addEventListener("click", bet);
    id("deal").addEventListener("click", deal);
    id("hit").addEventListener("click", hit);
    id("stand").addEventListener("click", stand);
    id("playagain").addEventListener("click", playAgain);
  }

  /**
   * This function requests
   * @param {event} evnt - event of submitting the submit button
   */
  function playGame(evnt) {
    evnt.preventDefault();
    let params = new FormData(id("login-form"));
    username = params.get("username");
    let money = localStorage.getItem(username);
    if (money) {
      id("money").textContent = money;
    } else {
      localStorage.setItem(username, "500");
    }
    id("login").classList.add("hidden");
    id("game").classList.remove("hidden");
  }

  /**
   * This function requests json from the API after a user has guessed a letter.
   * @param {event} event - event of submitting the submit button
   */
  function bet(event) {
    if (parseInt(id("money").textContent) - parseInt(event.target.value) > -1) {
      id("bet-amount").textContent = parseInt(id("bet-amount").textContent) + parseInt(event.target.value);
    let money = parseInt(id("money").textContent) - parseInt(event.target.value);
    id("money").textContent = money;
    localStorage.setItem(username, money);
    }
  }

  /**
   * This function requests
   */
  function deal() {
    id("message").classList.add("hidden");
    id("dname").classList.remove("hidden");
    id("pname").classList.remove("hidden");
    id("hit").classList.remove("hidden");
    id("stand").classList.remove("hidden");
    id("ten").disabled = true;
    id("fifty").disabled = true;
    id("deal").classList.add("hidden");
    let cardDOne = genCard();
    cardDOne.src = "img/back.png";
    cardDOne.id = "facedown";
    cardDOne.classList.add("dcard");
    id("dealer-cards").appendChild(cardDOne);
    let cardDTwo = genCard();
    cardDTwo.classList.add("dcard");
    id("dealer-cards").appendChild(cardDTwo);
    let cardPOne = genCard();
    cardPOne.classList.add("pcard");
    id("player-cards").appendChild(cardPOne);
    let cardPTwo = genCard();
    cardPTwo.classList.add("pcard");
    id("player-cards").appendChild(cardPTwo);
    let allCards = qsa(".pcard");
    let playerTotal = calculateHand(allCards);
    id("pname").textContent = "Player: " + playerTotal;
  }

  /**
   * This function requests json from the API after a user has guessed a letter.
   */
  function hit() {
    let newCard = genCard();
    newCard.classList.add("pcard");
    id("player-cards").appendChild(newCard);
    let allCards = qsa(".pcard");
    let playerTotal = calculateHand(allCards);
    id("pname").textContent = "Player: " + playerTotal;
    if (playerTotal > 21) {
      id("pname").textContent = "Player: " + playerTotal;
      id("result").textContent = "BUST!";
      id("hit").disabled = true;
      id("stand").disabled = true;
      id("playagain").classList.remove("hidden");
    }
  }

  /**
   * This function requests json from the API after a user has guessed a letter.
   */
  function stand() {
    let allCards = qsa(".pcard");
    let playerTotal = calculateHand(allCards);
    id("pname").textContent = "Player: " + playerTotal;


    let dealerCards = qsa(".dcard");
    let dealerTotal = calculateHand(dealerCards);
    id("dname").textContent += dealerTotal;

    while (dealerTotal < 17 && playerTotal < 22) {
      let newCard = genCard();
      id("dealer-cards").appendChild(newCard);
      if (newCard.value === 1 && dealerTotal + 10 < 22) {
        dealerTotal += 11;
      } else {
        dealerTotal = dealerTotal + newCard.value;
      }
    }
    id("dname").textContent = "Dealer: " + dealerTotal;

    id("facedown").src = "img/c" + id("facedown").value + ".png";

    if (playerTotal === dealerTotal) {
      id("result").textContent = "PUSH!";
      let money = parseInt(id("money").textContent) + parseInt(id("bet-amount").textContent);
      id("money").textContent = money;
      localStorage.setItem(username, money);
    } else if (playerTotal > dealerTotal && playerTotal < 22 || dealerTotal > 21) {
      id("result").textContent = "YOU WIN!";
      let money = parseInt(id("money").textContent) + 2 * parseInt(id("bet-amount").textContent);
      id("money").textContent = money;
      localStorage.setItem(username, money);
    } else {
      id("result").textContent = "DEALER WINS!";
    }

    id("hit").disabled = true;
    id("stand").disabled = true;

    id("playagain").classList.remove("hidden");
  }

  /**
   * This function requests json from the API after a user has guessed a letter.
   */
  function playAgain() {
    id("dname").textContent = "Dealer: ";
    id("pname").textContent = "Player: ";
    id("message").classList.remove("hidden");
    id("dname").classList.add("hidden");
    id("pname").classList.add("hidden");
    cardsPlayed = [];
    id("result").textContent = "";
    id("playagain").classList.add("hidden");
    id("hit").classList.add("hidden");
    id("stand").classList.add("hidden");
    id("ten").disabled = false;
    id("fifty").disabled = false;
    id("hit").disabled = false;
    id("stand").disabled = false;
    id("deal").classList.remove("hidden");
    id("bet-amount").textContent = 0;
    id("dealer-cards").innerHTML = "";
    id("player-cards").innerHTML = "";
  }

  /**
   * This function requests json from the API after a user has guessed a letter.
   */
  function genCard() {
    let newNumber = Math.floor(Math.random() * 13 + 1);
    let newCard = gen("img");
    if (cardsPlayed.includes(newNumber)) {
      newCard.src = "img/h" + newNumber + ".png";
    } else {
      newCard.src = "img/c" + newNumber + ".png";
    }
    newCard.value = newNumber;
    cardsPlayed.push(newNumber);
    return newCard;
  }

    /**
   * This function calculates value of all cards in hand
   * @param {Array} arr - array of card img html elements
   */
  function calculateHand(arr) {
    let ace = false;
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value > 10) {
        total += 10;
      } else {
        if (arr[i].value === 1) {
          ace = true;
        }
        total += arr[i].value;
      }
    }
    if (ace && total + 10 < 22) {
      total += 10;
    }
    return total;
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