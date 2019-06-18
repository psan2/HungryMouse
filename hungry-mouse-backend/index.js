const MATCH_URL='http://localhost:3000/matches/1'
const GAME_URL='http://localhost:3000/games/1'

function setFood(foodId, xPos, yPos, verticalPos) {

    const options = {
        method: "PATCH",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        food_id: foodId,
        x_pos: xPos,
        y_pos: yPos,
        vertical: verticalPos
        })
    };

  return fetch(MATCH_URL, options)
    .then( data => data.json())
    .then(currentFood => console.log(currentFood)
  );
}

function initGame(gameId, qtyColumns, qtyRows ) {

    const options = {
        method: "PATCH",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            game_id: gameId,
            qty_columns: qtyColumns,
            qty_rows: qtyRows
        })
    };

  return fetch(GAME_URL, options)
    .then( data => data.json())
    .then(currentGame => console.log(currentGame)
  );


}



