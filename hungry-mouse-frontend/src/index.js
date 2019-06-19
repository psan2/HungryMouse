const BASE_URL = "http://localhost:3000";
const GAME_URL = `${BASE_URL}/games/1`;
const BITE_URL = `${BASE_URL}/bite`;
const MATCH_URL = `${BASE_URL}/matches/2`;
const GAMEBOARD = document.querySelector("#game-grid");
const BODY = document.querySelector("body");
const SIDEBAR = document.querySelector("#sidebar");

let gameInfo;
let playerMatchInfo;
let foods;
let foodCounter;
let currentFood;

document.addEventListener("DOMContentLoaded", init());

//fetchGrid starts the game by PATCHing criteria for the grid to the DB - these values are hard coded but may be updated in the future
//then passes the game object to generateRows
function fetchGrid() {
  const gridWidth = 20;
  const gridLength = 20;
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      game_id: 1,
      qty_columns: gridWidth,
      qty_rows: gridLength
    })
  };

  return fetch(GAME_URL, options) //add /1 when changed to patch
    .then(resp => resp.json())
    .then(data => generateRows(data));
}

//generateRows generates the initial grid and assigns the necessary identifying information for future manipulation
//this function does not call any additional functions - the next action is triggered by the start button
function generateRows(gameInfo) {
  for (let y_pos = 0; y_pos < gameInfo.qty_columns; y_pos++) {
    const tr = document.createElement("tr");
    tr.id = `r${y_pos + 1}`;
    GAMEBOARD.appendChild(tr);
    for (let x_pos = 0; x_pos < gameInfo.qty_rows; x_pos++) {
      const td = document.createElement("td");
      td.dataset.y_pos = `${y_pos + 1}`;
      td.dataset.x_pos = `${x_pos + 1}`;
      td.className = "grid-square";
      tr.appendChild(td);
    }
  }

  const start = document.createElement("button");
  start.id = "start-button";
  start.textContent = "Start game";
  start.addEventListener("click", startGame);
  BODY.appendChild(start);
}

//startGame receives a click from the start button, removes the start button, and calls fetchMatch
function startGame(e) {
  e.preventDefault();
  document.querySelector("#start-button").remove();
  fetchMatch();
}

//fetchMatch fetches the player's Match object from the DB
//then calls placementState
function fetchMatch() {
  foodCounter = 0;
  fetch(MATCH_URL)
    .then(resp => resp.json())
    .then(matchJson => (matchInfo = matchJson))
    .then(() => placementState());
}

//placementState assigns the foods for this match to the state-wide variable foods, then sets the initial food to be placed and calls addPlacementListeners
function placementState() {
  foods = matchInfo.foods;
  currentFood = foods[foodCounter];
  sidebarCurrentFood();
  addGridListeners(addFoodToSquare);
}

//adds a specified event listener to all grid squares
function addGridListeners(func) {
  const squares = document.querySelectorAll(".grid-square");
  squares.forEach(square => {
    square.addEventListener("click", func);
  });
}

//removes a specified event listener from all grid squares
function removeGridListeners(func) {
  const squares = document.querySelectorAll(".grid-square");
  squares.forEach(square => {
    square.removeEventListener("click", func);
  });
}

//sidebarCurrentFood is called after placement listeners are added to grid, to display the food you're currently placing
//clicking on the displayed food will rotate it
function sidebarCurrentFood() {
  const h3 = document.createElement("h3");
  h3.textContent = "Now placing...";
  SIDEBAR.appendChild(h3);

  const table = document.createElement("table");
  table.id = "food-display";
  table.dataset.name = currentFood.name;

  if (currentFood.vertical) {
    for (let i = 0; i < currentFood.length; ++i) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.style.backgroundColor = "blue";
      tr.appendChild(td);
      table.appendChild(tr);
    }
  } else {
    const tr = document.createElement("tr");
    for (let i = 0; i < currentFood.item_length; ++i) {
      const td = document.createElement("td");
      td.style.backgroundColor = "blue";
      tr.appendChild(td);
      table.appendChild(tr);
    }
  }

  SIDEBAR.appendChild(table);
}

//addFoodToSquare takes an event from the placement listeners, if a food is vertical, then sends the starting location of the food back to the DB
//then calls renderFoodGrids to render the placement in the DOM
function addFoodToSquare(e) {
  const clickedSquare = e.target;
  const x_pos = clickedSquare.dataset.x_pos;
  const y_pos = clickedSquare.dataset.y_pos;
  if (currentFood.vertical) {
    currentFood.vertical = true;
  } else {
    currentFood.vertical = false;
  }

  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      food_id: currentFood.id,
      x_pos: x_pos,
      y_pos: y_pos,
      vertical: currentFood.vertical
    })
  };

  fetch(MATCH_URL, options)
    .then(resp => resp.json())
    .then(foodGridSquares => renderFoodGrids(foodGridSquares));
}

//renderFoodGrids checks the reply from the DB to ensure food was validly placed, then shades cells where a food was placed
//if there are more foods to be placed, the placementState is called again
//if all foods have been placed, the game enters gameState
function renderFoodGrids(foodGridSquares) {
  if (foodGridSquares.length != 0) {
    foodGridSquares.forEach(gridSquare => {
      SIDEBAR.innerHTML = "";
      const targetSquare = document.querySelector(
        `[data-x_pos='${gridSquare.x_pos}'][data-y_pos='${gridSquare.y_pos}']`
      );
      targetSquare.style.backgroundColor = "blue";
    });
    removeGridListeners(addFoodToSquare);
    if (foodCounter >= foods.length - 1) {
      gameState();
    } else {
      foodCounter++;
      placementState();
    }
  } else {
    alert("Can't put food where it would fall off the table!");
  }
}

//fetches initial grid - called when page is loaded
function init() {
  fetchGrid();
}

function gameState() {
  addGridListeners(takeABite);
}

function takeABite(e) {
  const clickedSquare = e.target;
  const x_pos = clickedSquare.dataset.x_pos;
  const y_pos = clickedSquare.dataset.y_pos;

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      match_id: matchInfo.id,
      x_pos: x_pos,
      y_pos: y_pos
    })
  };

  fetch(BITE_URL, options)
    .then(resp => resp.json())
    .then(console.log);
}
