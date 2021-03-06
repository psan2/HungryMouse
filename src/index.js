const BASE_URL = "http://localhost:3000";
const GAME_URL = `${BASE_URL}/games/1`;
const BITE_URL = `${BASE_URL}/bite`;
const MATCH_URL = `${BASE_URL}/matches/2`;
const FIRSTGRID = document.querySelector("#left-grid");
const SECONDGRID = document.querySelector("#right-grid");
const BODY = document.querySelector("body");
const SIDEBAR = document.querySelector("#sidebar");
const ROW_COUNT = 10;
const COL_COUNT = 10;
const STARTBUTTON = document.querySelector("#start-button");
STARTBUTTON.addEventListener("click", startGame);
const RESTARTBUTTON = document.querySelector("#restart-button");
RESTARTBUTTON.addEventListener("click", () => init());

let gameInfo;
let playerMatchInfo;
let foods;
let foodCounter;
let currentFood;
let placementListener;
let biteListener;

document.addEventListener("DOMContentLoaded", init());

//fetchGrids starts the game by PATCHing criteria for the grid to the DB - these values are hard coded but may be updated in the future
//then passes the game object to generateRows
function fetchGrids() {
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      game_id: 1,
      qty_columns: COL_COUNT,
      qty_rows: ROW_COUNT
    })
  };

  return fetch(GAME_URL, options) //add /1 when changed to patch
    .then(resp => resp.json())
    .then(gameData => generateBothGrids(gameData));
}

function generateBothGrids(gameData) {
  generateRows(gameData, FIRSTGRID);
  generateRows(gameData, SECONDGRID);
}

//generateRows generates the initial grid and assigns the necessary identifying information for future manipulation
//this function does not call any additional functions - the next action is triggered by the start button
function generateRows(gameInfo, targetGrid) {
  for (let y_pos = 0; y_pos < gameInfo.qty_columns; y_pos++) {
    const tr = document.createElement("tr");
    tr.id = `r${y_pos + 1}`;

    const rowNumber = document.createElement("td");
    rowNumber.textContent = y_pos + 1;
    rowNumber.style.textAlign = "right";
    tr.appendChild(rowNumber);

    targetGrid.appendChild(tr);
    for (let x_pos = 0; x_pos < gameInfo.qty_rows; x_pos++) {
      const td = document.createElement("td");
      td.dataset.y_pos = `${y_pos + 1}`;
      td.dataset.x_pos = `${x_pos + 1}`;
      td.className = "grid-square";
      tr.appendChild(td);
    }
  }
  for (let num = 0; num <= gameInfo.qty_rows; num++) {
    const colNumber = document.createElement("td");
    if (num > 0) {
      colNumber.textContent = num;
    }
    colNumber.style.textAlign = "center";
    targetGrid.appendChild(colNumber);
  }
}

// const start = document.createElement("button");
// start.id = "start-button";
// start.textContent = "Start game";
// start.addEventListener("click", startGame);
// BODY.appendChild(start);

//startGame receives a click from the start button, removes the start button, and calls fetchMatch
function startGame(e) {
  e.preventDefault();
  STARTBUTTON.style.display = "none";
  fetchMatch();
}

//fetchMatch fetches the player's Match object from the DB
//then calls placementState
//foodCounter keeps track of what item in the foods array we're placing on the board - resets to beginning of array at the start of each game
function fetchMatch() {
  foodCounter = 0;
  fetch(MATCH_URL)
    .then(resp => resp.json())
    .then(matchJson => (matchInfo = matchJson))
    .then(() => placementState());
}

//placementState assigns the foods for this match to the state-wide variable foods, then sets the initial food to be placed and calls addPlacementListeners
//foods array is created based on the template food list the db has for this match
//currentFood is the food we're placing, identified by the foodCounter index (which will be incremented later)
//sidebarCurrentFood displays the shape of the food the user is placing
function placementState() {
  foods = matchInfo.foods;
  currentFood = foods[foodCounter];
  sidebarCurrentFood();
  addPlacementListener(addFoodToSquare);
}

//adds a specified event listener to gameboard
function addPlacementListener(func) {
  placementListener = func;
  FIRSTGRID.addEventListener("click", placementListener);
}

//removes a specified event listener from gameboard
function removePlacementListener() {
  FIRSTGRID.removeEventListener("click", placementListener);
}

//adds a specified event listener to gameboard
function addBiteListener(func) {
  biteListener = func;
  SECONDGRID.addEventListener("click", biteListener);
}

//removes a specified event listener from gameboard
function removeBiteListener() {
  SECONDGRID.removeEventListener("click", biteListener);
}

//sidebarCurrentFood is called after placement listeners are added to grid, to display the food you're currently placing
//clicking on the displayed food will rotate it
function sidebarCurrentFood() {
  const h3 = document.createElement("h3");
  h3.textContent = "↙️ Click a square to place food";
  SIDEBAR.appendChild(h3);

  const table = document.createElement("table");
  table.id = "food-display";
  table.dataset.name = currentFood.name;

  if (currentFood.vertical) {
    for (let i = 0; i < currentFood.item_length; ++i) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.className = `grid-square sidebar-grid ${currentFood.name}`;
      tr.appendChild(td);
      table.appendChild(tr);
    }
  } else {
    const tr = document.createElement("tr");
    for (let i = 0; i < currentFood.item_length; ++i) {
      const td = document.createElement("td");
      td.className = `grid-square sidebar-grid ${currentFood.name}`;
      tr.appendChild(td);
      table.appendChild(tr);
    }
  }
  const em = document.createElement("EM");
  em.textContent = "Click to rotate";
  SIDEBAR.appendChild(em);

  SIDEBAR.appendChild(table);
  const sidebarGrid = document.querySelectorAll(".sidebar-grid");
  sidebarGrid.forEach(grid =>
    grid.addEventListener("click", rotateSidebarGrid)
  );
}

//rotates sidebar grid cheese
function rotateSidebarGrid() {
  currentFood.vertical = !currentFood.vertical;
  SIDEBAR.innerHTML = "";
  sidebarCurrentFood();
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
      targetSquare.className += ` ${currentFood.name}`;
    });

    removePlacementListener();

    if (foodCounter >= foods.length - 1) {
      gameState();
    } else {
      foodCounter++;
      placementState();
    }
  } else {
    alert(
      "Invalid placement location - please ensure food is on the table, and not overlapping"
    );
  }
}

//fetches initial grid - called when page is loaded
function init() {
  STARTBUTTON.style.display = "block";
  FIRSTGRID.innerHTML = "";
  SECONDGRID.innerHTML = "";
  SIDEBAR.innerHTML = "";
  fetchGrids();
}

function gameState() {
  const guide = document.createElement("span");
  guide.innerHTML =
    "Click a square on their table to bite ↘️<br>The computer will bite after!";
  SIDEBAR.appendChild(guide);
  addBiteListener(takeABite);
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
    .then(renderBites);
}

function renderBites(biteJson) {
  const userBite = biteJson.this_shot;
  const computerBites = biteJson.ai_shots;

  if (!userBite.won) {
    renderUserBite(userBite);
    setTimeout(function() {
      renderMultComputerBites(computerBites);
    }, 500);
  } else {
    renderUserBite(userBite);
    endGame(userBite.player);
  }
}

function renderUserBite(userBite) {
  const nibbledFood = userBite.nibbled_food;
  const userBiteSquare = document.querySelector(
    `#right-grid [data-x_pos='${userBite.x_pos}'][data-y_pos='${
      userBite.y_pos
    }']`
  );
  if (userBiteSquare.dataset.nibbled === "true") {
  } else if (nibbledFood) {
    userBiteSquare.className += ` ${nibbledFood}-bitten`;
    userBiteSquare.dataset.nibbled = "true";
  } else {
    userBiteSquare.className = `${userBiteSquare.className}-bitten`;
    userBiteSquare.dataset.nibbled = "true";
  }
}

function renderMultComputerBites(computerBites) {
  for (let i = 0; i < computerBites.length; i++) {
    const computerBite = computerBites[i];
    const computerBiteSquare = document.querySelector(
      `#left-grid [data-x_pos='${computerBite.x_pos}'][data-y_pos='${
        computerBite.y_pos
      }']`
    );
    computerBiteSquare.className = `${computerBiteSquare.className}-bitten`;
    if (computerBite.won) {
      endGame(computerBite.player);
    }
  }
}

function endGame(player) {
  removeBiteListener(takeABite);
  SIDEBAR.innerHTML = "";

  const winner = document.createElement("h2");

  if (player === "Computer") {
    const message = document.createElement("h2");
    message.textContent = "GAME OVER";
    winner.textContent = "COMPUTER WINS";
    winner.style.color = "red";
    message.style.color = "red";
    SIDEBAR.appendChild(message);
    toggleLeaderboard("computer");
  } else if (player === "2nd player") {
    winner.textContent = "YOU WIN";
    winner.style.color = "green";
    toggleLeaderboard("player");
  }

  SIDEBAR.appendChild(winner);

  setInterval(function() {
    winner.style.display = winner.style.display == "none" ? "" : "none";
  }, 500);
}

const LEADERBOARDFORM = document.querySelector("#new-name-form");
LEADERBOARDFORM.addEventListener("submit", newLeaderboardPlayer);
const ESCAPE = document.querySelector(".escape");
ESCAPE.addEventListener("click", () => toggleLeaderboard());

function toggleLeaderboard(winner) {
  const overlay = document.querySelector(".overlay");
  const form = document.querySelector("#new-name-form");
  const table = document.querySelector("#leaderboard-table");
  table.style.display = "none";
  if (winner === undefined) {
    overlay.style.display = "none";
  } else if (winner === "computer") {
    form.style.display = "none";
    overlay.style.display = "block";
    postNewWinnerToDb("Computer");
  } else if (winner === "player") {
    overlay.style.display = "block";
    form.style.display = "block";
  }
}

function newLeaderboardPlayer(e) {
  e.preventDefault();
  const form = e.target;
  const newName = form[0].value;
  form[0].value = "";
  form.style.display = "none";
  postNewWinnerToDb(newName);
}

function postNewWinnerToDb(winnerName) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: winnerName
    })
  };

  fetch(BASE_URL + "/leaderboards", options)
    .then(resp => resp.json())
    .then(formatLeaderboard);
}

function formatLeaderboard(leaderboardJson) {
  let accumulator = {};
  const winners = leaderboardJson.map(winner => winner.name);

  let reducer = function(winCounts, winner) {
    if (!winCounts[winner]) {
      winCounts[winner] = 1;
    } else {
      winCounts[winner] = winCounts[winner] + 1;
    }
    return winCounts;
  };

  const winnerObj = winners.reduce(reducer, accumulator);

  let sortable = [];
  for (let winner in winnerObj) {
    sortable.push([winner, winnerObj[winner]]);
  }

  sortable.sort((a, b) => b[1] - a[1]);

  renderLeaderboard(sortable);
}

function renderLeaderboard(sortedArray) {
  const table = document.querySelector("#leaderboard-table");
  const tbody = document.querySelector("#leaderboard-table tbody");
  tbody.innerHTML = "";

  table.style.display = "block";

  sortedArray.forEach(winnerArr => {
    const tr = document.createElement("tr");
    const name = document.createElement("td");
    name.className = "lb-name";
    const wins = document.createElement("td");
    wins.className = "lb-wins";

    name.textContent = winnerArr[0];
    wins.textContent = winnerArr[1];

    tr.appendChild(name);
    tr.appendChild(wins);
    tbody.appendChild(tr);
  });
}
