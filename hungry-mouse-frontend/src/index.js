const BASE_URL = "http://localhost:3000";
const GRID_URL = `${BASE_URL}/grid`;
const FOOD_URL = `${BASE_URL}/food`;
const MATCH_URL = `${BASE_URL}/matches`;
const gameBoard = document.querySelector("#game-grid");
const body = document.querySelector("body");
let matchInfo;
let foods;
let foodCounter = 0;

function fetchGrid() {
  fetch(GRID_URL)
    .then(resp => resp.json())
    .then(generateRows);
}

function generateRows(gridArray) {
  for (let y_pos = 0; y_pos < gridArray.length; y_pos++) {
    const tr = document.createElement("tr");
    tr.id = `r${y_pos + 1}`;
    gameBoard.appendChild(tr);
    for (let x_pos = 0; x_pos < gridArray[y_pos].length; x_pos++) {
      const td = document.createElement("td");
      td.dataset.y_pos = `${y_pos + 1}`;
      td.dataset.x_pos = `${x_pos + 1}`;
      td.className = "grid-square";
      td.height = "25px";
      td.width = "25px";
      tr.appendChild(td);
    }
  }

  const start = document.createElement("button");
  start.id = "start-button";
  start.textContent = "Start game";
  start.addEventListener("click", startGame);
  body.appendChild(start);
}

function startGame(e) {
  e.preventDefault();
  document.querySelector("#start-button").remove();
  fetchMatch();
}

function fetchMatch() {
  fetch(MATCH_URL)
    .then(resp => resp.json())
    .then(matchJson => (matchInfo = matchJson))
    .then(() => placementState());
}

function placementState() {
  foods = matchInfo.food;
  if (foods[foods.length - 1].x_pos == null) {
    const currentFood = foods[foodCounter];
    placeFood(currentFood);
  } else {
    gameState();
  }
}

function placeFood(currentFood) {
  const squares = document.querySelectorAll(".grid-square");
  squares.forEach(square => {
    square.addEventListener("click", e => addFoodToSquare(e, currentFood));
  });
}

function addFoodToSquare(e, currentFood) {
  const clickedSquare = e.target;
  currentFood.x_pos = clickedSquare.dataset.x_pos;
  currentFood.y_pos = clickedSquare.dataset.y_pos;

  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      food_id: currentFood.id,
      x_pos: currentFood.x_pos,
      y_pos: currentFood.y_pos,
      vertical: currentFood.vertical
    })
  };

  fetch(MATCH_URL, options)
    .then(resp => resp.json())
    .then(foodGridSquares => renderFoodGrid(foodGridSquares)); //need to re-connect the response to the function
}

function renderFoodGrids(foodGridSquares) {
  //need to re-add args to this function
}

function init() {
  fetchGrid();
}

init();
