const BASE_URL = "http://localhost:3000";
const GRID_URL = `${BASE_URL}/grid`;
const FOOD_URL = `${BASE_URL}/food`;
const gameBoard = document.querySelector("#game-grid");
const body = document.querySelector("body");

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
      td.dataset.gridLocation = `[${y + 1}][${x + 1}]`;
      td.height = "22px";
      td.width = "22px";
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
  fetchFood();
}

function fetchFood() {
  fetch(FOOD_URL)
    .then(resp => resp.json())
    .then(foodArray => foodArray.forEach(food => placeFood(food)));
}

function placeFood(food) {
  const length = food.length;

  alert(`Please select where you'd like to place your ${food.name}`);
}

function placementGrid() {}

function init() {
  fetchGrid();
}

init();
