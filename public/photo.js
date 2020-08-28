/*
 * Name: Tyler Wong
 * Date: May 2, 2020
 * Section: CSE 154 AJ
 *
 * This is the JS to implement the UI for my photo gallery. It makes it so
 * buttons toggle between the main menu and the actual photo gallery with the
 * pictures. It also fetches from Lorem Picsum API to get all the pictures
 * in the photo gallery.
 */

"use strict";

/**
 * This is the self calling anonymous function that holds everything else.
 */
(function() {

  const BASE_URL = "https://picsum.photos"; // you may have more than one
  const START_PAGE_NUM = 1;
  const PAGE_NUM_CAP = 10;
  let pageNumber = START_PAGE_NUM;

  window.addEventListener("load", init);

  /**
   * This funcion initialized the other functions once the page is loaded.
   */
  function init() {
    id("go-color").addEventListener("click", showImages);
    id("go-gray").addEventListener("click", showImages);
    id("back").addEventListener("click", backToMenu);
    id("new").addEventListener("click", getNewImages);
  }

  /**
   * When a button is clicked for either colored or gray photos, this function
   * toggles from the main menu to the photo gallery and fetches the images
   * from the Lorem Picsum API and puts them on the webpage.
   */
  function showImages() {
    toggle();
    let isColor = (this.id === "go-color");
    if (isColor) {
      qs("h2").textContent = "Colored Images";
      makeRequest();
    } else {
      qs("h2").textContent = "Grayscale Images";
      makeRequest();
    }
  }

  /**
   * When the back button is clicked, this function toggles back to the main
   * menu, and clears all the images.
   */
  function backToMenu() {
    toggle();
    clearImages();
    pageNumber = START_PAGE_NUM;
  }

  /**
   * This funcion clears all the images from the photo gallery.
   */
  function clearImages() {
    let photos = id("pictures").children;
    while (photos.length > 0) {
      photos[0].remove();
    }
  }

  /**
   * When the get new images button is clicked, this function clears the old
   * images and replaces them all with new images by fetching the new images
   * from the Lorem Picsum API.
   */
  function getNewImages() {
    if (pageNumber < PAGE_NUM_CAP) {
      pageNumber++;
    }
    clearImages();
    makeRequest();
  }

  /**
   * This funcion toggles between the main menu and the photo gallery.
   */
  function toggle() {
    id("menu").classList.toggle("hidden");
    id("images").classList.toggle("hidden");
  }

  /**
   * This funcion fetches a list of images from the Lorem Picsum API. It then
   * checks the status code. Next it converts the APIs response from a json
   * string to actual json. Last it puts the images in the image list onto
   * the webpage. If any errors occur it catches them and displays a message
   * telling the user that the images didn't come.
   */
  function makeRequest() {
    let url = BASE_URL + "/v2/list?page=" + pageNumber + "&limit=12";
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleError);
  }

  /**
   * This funcion puts the images from the Lorem Picsum API in the image
   * list onto the webpage. If the user wanted them in grayscale it makes
   * them grayscale, otherwise it leaves them as colored.
   * @param {JSON} responseData - the response of the API in JSON form
   */
  function processData(responseData) {
    let color = "";
    if (qs("h2").textContent === "Grayscale Images") {
      color = "?grayscale";
    }
    for (let i = 0; i < responseData.length; i++) {
      let image = gen("img");
      image.src = responseData[i].download_url + color;
      id("pictures").appendChild(image);
    }
  }

  /**
   * This funcion checks the status code of the API request. If it is ok, then
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
   * If any errors occur during the request fromt he API this function
   * catches them and displays a message telling the user that the images
   * didn't come.
   * @param {error} err - error thrown by check status with the status code text
   */
  function handleError(err) {
    let errorMessage = gen("p");
    errorMessage.textContent = "Sorry could not load images due to error: " + err.message;
    id("pictures").appendChild(errorMessage);
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

