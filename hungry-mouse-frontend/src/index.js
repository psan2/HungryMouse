const GRID_URL = "http://localhost:3000/grid";
const gameBoard = document.querySelector("#game-grid");

function fetchGrid() {
  fetch(GRID_URL)
    .then(resp => resp.json())
    .then(resp => generateRows(resp[0]));
}

function generateRows(gridArray) {
  debugger;
  for (let y = 0; y < gridArray.length; y++) {
    const tr = document.createElement("tr");
    tr.setAttribute("id", `r${y + 1}`);
    gameBoard.appendChild(tr);
    for (let x = 0; x < gridArray[y].length; x++) {
      const td = document.createElement("td");
      td.setAttribute("id", `r${y + 1}c${x + 1}`);
      tr.appendChild(td);
    }
  }
}
