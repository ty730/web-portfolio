/*
 * Name: Tyler Wong
 * Date: May 17, 2020
 * Section: CSE 154 AJ
 *
 * This is the JS to implement the UI for my word guesser game. It makes it so
 * when the generate new word button is clicked it requests a new random four
 * letter word from the Word Guesser API, which is uses to play a new guessing game.
 * It then unhides the game view and whenever a letter is submitted by the user
 * it requests from the API the result of the guess, updating the games information
 * on the page. Once the user guesses the word from the API it congratulates them
 * and allows them to play again.
 */

"use strict";

/**
 * This is the self calling anonymous function that holds everything else.
 */
(function() {
  let word;

  window.addEventListener("load", init);

  /**
   * This function initialized the functions for making requests when buttons are
   * clicked or submitted.
   */
  function init() {
    id("guess-form").addEventListener("submit", makeGuess);
    id("new-word").addEventListener("click", getWord);
  }

  /**
   * This function fetches a single random four letter word fromt the Word Guesser
   * API to use in a game of word gueser.
   */
  function getWord() {
    let url = "/guess";
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.text())
      .then(playGuesser)
      .catch(handleError);
  }

  /**
   * This function requests json from the API after a user has guessed a letter.
   * It prevents the page from refreshing when the submission happens by preventing
   * the given event from doing default action. It makes the request to the API
   * with the previously requested random word, the current pattern shown on the page,
   * and the letter that the user inputted. It uses the APIs response to update the
   * information on the page about the game.
   * @param {event} evnt - event of submitting the submit button
   */
  function makeGuess(evnt) {
    evnt.preventDefault();
    let url = "/guess";
    let guess = id("guess").value;
    if (id("letters-guessed").textContent.includes(guess)) {
      id("message").textContent = "You already guessed " + guess.toUpperCase() + "!";
      id("guess").value = "";
    } else {
      id("message").textContent = "";
      let params = new FormData(id("guess-form"));
      let pattern = id("word").textContent;
      params.append("word", word);
      params.append("pattern", pattern);
      fetch(url, {method: "POST", body: params})
        .then(checkStatus)
        .then(resp => resp.json())
        .then(processData)
        .catch(handleError);
    }
  }

  /**
   * This function takes a random word returned from the API and initializes the
   * game view and sets the word to be guessed to that random word.
   * @param {text} randomWord - the random word response of the API in text form
   */
  function playGuesser(randomWord) {
    word = randomWord;
    id("word").textContent = "____";
    id("guess-count").textContent = "0";
    id("letters-guessed").textContent = "";
    id("message").textContent = "";
    id("start").classList.add("hidden");
    id("game").classList.remove("hidden");
    id("submit-btn").disabled = false;
  }

  /**
   * This function updates the game views information to match the information
   * returned by the API. Also, if the full word has been guessed it congratulates
   * the user and allows them to generate a new word for a new game.
   * @param {JSON} result - the response of the API in JSON form
   */
  function processData(result) {
    id("word").textContent = result.pattern;
    id("guess-count").textContent++;
    if (id("letters-guessed").textContent === "") {
      id("letters-guessed").textContent = result.letter;
    } else {
      id("letters-guessed").textContent += ", " + result.letter;
    }
    id("guess").value = "";
    if (result.pattern === result.word) {
      wordHasBeenGuessed(result.word);
    }
  }

  /**
   * If the given answer word has been fully guessed then it congratulates the user,
   * telling them the word and how many guesses it took. Then adding the given answer
   * word to the list of words that the user has guessed so far. It also allows the
   * user to generate a new word in order to play a new game.
   * @param {text} answerWord - four letter word that has been fully guessed
   */
  function wordHasBeenGuessed(answerWord) {
    let count = id("guess-count").textContent;
    id("message").textContent = "You guessed it! The word is " + answerWord.toUpperCase() +
      "! And it only took you " + count + " guesses!";
    id("new-word").textContent = "Generate Another Word!";
    id("start").classList.remove("hidden");
    id("submit-btn").disabled = true;
    if (id("words-guessed")) {
      id("words-guessed").textContent += ", " + answerWord;
    } else {
      let paragraph = gen("p");
      paragraph.textContent = "Words you've guessed: " + answerWord;
      paragraph.id = "words-guessed";
      id("game").appendChild(paragraph);
    }
  }

  /**
   * This function checks the status code of the API request. If it is ok, then
   * it returns the APIs response. Otherwise it throws an error.
   * @param {API-respose} response - the APIs response to the request
   * @returns {API-response} returns the APIs response
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw Error("Error in request: " + response.statusText);
    }
  }

  /**
   * If any errors occur during the request from the API this function
   * catches them and displays a message telling the user what the error is.
   * @param {error} err - error thrown by check status with the status code text
   */
  function handleError(err) {
    id("message").textContent = err.message;
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
   * Returns the new element of given type
   * @param {string} elType - an elements type
   * @returns {element} new element of the given type.
   */
  function gen(elType) {
    return document.createElement(elType);
  }
})();

