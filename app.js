/*
 * Name: Tyler Wong
 * Date: May 17, 2020
 * Section: CSE 154 AJ
 *
 * This is the JS for the server side of the Word Guesser API. It is hosted at port
 * 8000. It has two endpoints, one GET and one POST. The GET endpoint returns
 * text of a four letter word. The POST endpoint returns JSON of the given word,
 * letter, and updated pattern.
 */
"use strict";

const express = require("express");
const app = express();

const multer = require("multer");
const PORT_NUM = 8000;
const BAD_REQUEST = 400;

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for parsing application/json
app.use(express.json()); // built-in middleware
// for parsing multipart/form-data (required with FormData)
app.use(multer().none()); // multer middleware

let words = ["frog", "duck", "kiwi", "wolf", "lion", "goat", "bear", "dogs", "cats"];

/**
 * This is the GET request endpoint. People can request from it using /guess.
 * It will return a random four letter word in text format.
 */
app.get("/guess", function(req, res) {
  res.type("text");
  let rand = Math.floor(Math.random() * words.length);
  res.send(words[rand]);
});

/**
 * This is the POST request endpoint. People can request from it using /guess.
 * It requires that the request have the parameters letter, word, and pattern.
 * If any parameter is missing it will send back a 400 status message that a parameter
 * is missing. Also, if the letter is not one character it will send a 400 message
 * that the letter must be one character. If the request has no problems then it
 * will return json with the given letter and word, and also a possibly new pattern
 * if the letter is in the word, otherwise the pattern will be the same.
 */
app.post("/guess", (req, res) => {
  res.type("text");
  let letter = req.body.letter;
  let word = req.body.word;
  let pattern = req.body.pattern;
  if (!(letter && word && pattern)) {
    res.status(BAD_REQUEST).send("Missing POST parameter: letter, word and/or pattern");
  } else if (letter.length !== 1) {
    res.status(BAD_REQUEST).send("Letter must be one character long");
  } else {
    let indicies = [];
    for (let i = 0; i < word.length; i++) {
      if (word.charAt(i) === letter) {
        indicies.push(i);
      }
    }
    let result = {"letter": letter, "word": word, "pattern": pattern};
    if (indicies.length !== 0) {
      let patternArray = pattern.split("");
      for (let j = 0; j < indicies.length; j++) {
        patternArray[indicies[j]] = letter;
      }
      let newPattern = patternArray.join("");
      result.pattern = newPattern;
    }
    res.type("json").send(result);
  }
});

app.use(express.static("public"));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);
