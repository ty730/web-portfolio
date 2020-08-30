/*
 * Name: Tyler Wong
 * Date: May 2, 2020
 * Section: CSE 154 AJ
 *
 * This is the JS to implement the UI for
 */

/**
 * This is the self calling anonymous function that holds everything else.
 */
(function() {

  const BASE_URL = "http://api.weatherapi.com/v1"; // you may have more than one

  window.addEventListener("load", init);

  /**
   * This funcion initialized the other functions once the page is loaded.
   */
  function init() {
    id("search-form").addEventListener("submit", getWeather);
  }

  /**
   * This funcion fetches a list of
   * @param {JSON} event - dom event
   */
  function getWeather(event) {
    event.preventDefault();
    clearPage();
    let params = new FormData(id("search-form"));
    let city = params.get("search");
    let url = BASE_URL + "/current.json" + "?key=a17c82abdd044c36b3244319202808&q=" + city;
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
   * @param {JSON} response - the response of the API in JSON form
   */
  function processData(response) {
    id("info").classList.remove("hidden");
    let location = response.location.name + ", " + response.location.region;
    id("location").textContent = location;
    let temp = response.current.temp_f;
    id("temp").textContent = temp + " F";
    let condition = response.current.condition.text;
    id("condition").textContent = condition;
    let imageSrc = response.current.condition.icon;
    id("icon").src = "http:" + imageSrc;
    id("precip").textContent = "Precipitation: " + response.current.precip_in + " inches";
    id("wind").textContent = "Wind: " + response.current.wind_mph + "mph " + response.current.wind_dir
  }

  /**
   * This funcion puts the images from the Lorem Picsum API in the image
   * list onto the webpage. If the user wanted them in grayscale it makes
   * them grayscale, otherwise it leaves them as colored.
   */
  function clearPage() {
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
    console.log(err);
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