const BASE_URL = "http://localhost:3000";
const GRID_URL = `${BASE_URL}/grid`;
const FOOD_URL = `${BASE_URL}/food`;
const MATCH_URL = `${BASE_URL}/match`;
const gameBoard = document.querySelector("#game-grid");
const body = document.querySelector("body");
let foods;
let foodCounter = 0;

function fetchGrid() {
  fetch(GRID_URL)
    .then(resp => resp.json())
    .then(generateRows);
}

function generateRows(gridArray) {
  for (let y = 0; y < gridArray.length; y++) {
    const tr = document.createElement("tr");
    tr.id = `r${y + 1}`;
    gameBoard.appendChild(tr);
    for (let x = 0; x < gridArray[y].length; x++) {
      const td = document.createElement("td");
      td.dataset.y = `${y + 1}`;
      td.dataset.x = `${x + 1}`;
      td.className = "grid-square";
      td.height = "25px";
      td.width = "25px";
      // td.addEventListener("click", () =>
      //   alert(`You sunk my battleship! ${td.dataset.gridLocation}`)
      // );
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
  fetchFood();
}

function fetchFood() {
  fetch(FOOD_URL)
    .then(resp => resp.json())
    .then(foodArray => (foods = foodArray))
    .then(() => placementState());
}

function placementState() {
  if (foods[foods.length - 1].x == null) {
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
  currentFood.x = clickedSquare.dataset.x;
  currentFood.y = clickedSquare.dataset.y;

  debugger;
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id:
    })
  };

  return fetch(PUPS_URL + `/${id}`, options).then(() =>
    goodBadDogButton(state)
  );
}

function init() {
  fetchGrid();
}

init();
