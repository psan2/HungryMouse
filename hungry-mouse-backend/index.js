const MATCH_URL='http://localhost:3000/matches/1'
const MATCHBITE_URL='http://localhost:3000/bite'
const GAME_URL='http://localhost:3000/games/1'
const LEADER_URL='http://localhost:3000/leaderboards'

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

function leader(nameIn) {

    const options = {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: nameIn
        })
    };

  return fetch(LEADER_URL, options)
    .then( data => data.json())
    .then( console.log );
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

function bite(matchId, xPos, yPos ) {

    const options = {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            match_id: matchId,
            x_pos: xPos,
            y_pos: yPos
        })
    };

  return fetch(MATCHBITE_URL, options)
    .then( data => data.json())
    .then(currentGame => console.log(currentGame)
  );
}


// Lets simulate a game
initGame(1,10,10)
.then( () => setFood(2, 1, 1, false))
.then( () => setFood(4, 1, 1, true))
.then( () => bite(2,1,1))
.then( () => bite(2,2,1))
.then( () => bite(2,3,1))


// Helpers to test
// match=Match.find(2)
// match.food_grids.map{|fg|fg.food_id}.uniq
// match.foods.map{|f|f.id}
//food=Food.find(2)
//food.valid_position?(1,1)
