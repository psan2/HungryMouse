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
            food_to_eat=FoodGrid.where(["food_id=? and bite = false ", fg.food_id])
            if food_to_eat.length=0 
               other_foodgrid.food.eaten=true
               other_foodgrid.food.save
             # So if the food is eaten, see if there are any other uneaten foods for the match
        #         other_foods=fg.foods.match.foods.select {|f| f.eaten=false }
        #         if other_foods.length=0
        #             # We have a WINNER !!!!
        #             fg.foods.match.winner=true;
        #             fg.foods.match.winner.save
        #         end
             end # End the setting the food element to eaten
            } # End the other food_grid loop
          } # End the other_food loop
        } # End the other_match loop
    end
end
