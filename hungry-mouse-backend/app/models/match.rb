class Match < ApplicationRecord
    belongs_to :player
    belongs_to :game
    has_many :foods
    has_many :bites

    def other_matches
        self.game.matches.select {|match|match.id!=self.id}.each {|current_match| }
    end

    def bite(x_pos=0, y_pos=0)
# Run this for a player to take a nibble
# When a nibble is taken it can nibble or miss, 
# if nibble, it can eat the food fully or not
# if eaten the food, it could win the game
# After having a nibble, check if the next player in the sequence is a computer,
# if so, run their game, not passing in positions, so they are computer generated

# If either x_pos or y_pos is 0, autogenerate
# TODO

# Create the bite record
    thisbite = Bite.create(match_id:self.id, x_pos:x_pos, y_pos:y_pos)

    other_matches.each { |other_match|   
        other_match.foods.each { |other_food|
            FoodGrid.where(["food_id=? and x_pos=? and y_pos=?", other_food.id,x_pos, y_pos]).each {|other_foodgrid|
                other_foodgrid.bite=true
                other_foodgrid.save
        # If no other bits to bite, then set the food item to eaten
            food_to_eat=FoodGrid.where(["food_id=? and bite = false ", other_foodgrid.food_id])
            if food_to_eat.length==0 
               other_foodgrid.food.eaten=true
               other_foodgrid.food.save

             # So if the food is eaten, see if there are any other uneaten foods for any other players in the game
                 if other_match.foods.select {|f| f.eaten=false }.length==0
                     # This match is a loser ..... we can't say we are a winner just yet, as there may be more than 2 players
                     other_match.loser=true;
                     other_match.save
                 end # End the setting this player a loser stuff
 
                end # End the setting the food element to eaten
            } # End the other food_grid loop
          } # End the other_food loop
        } # End the other_match loop


    end
end
