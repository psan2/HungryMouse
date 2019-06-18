const MATCH_URL='http://localhost:3000/matches/1'

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



