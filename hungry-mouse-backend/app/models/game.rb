class Game < ApplicationRecord

    has_many :matches
    has_many :players, through: :matches
    has_many :foods, through: :matches
    has_many :food_grids, through: :foods
    has_many :bites, through: :matches
        
    def initialise_game
# Set the game up so a person can start positioning their items
#   This means removing data from the shots table
#   resetting the won item on matches and the eaten item on foods
        self.bites.destroy_all

# Don't delete the food grid position, but make sure bite is false
        self.food_grids.each { |f_g|  
            self.food_grids.bite=false;
            self.food_grids.save;
        } 

#        set foods eaten to false 
        self.foods.each { |food|  
            food.eaten=false;
            food.save;
        }

#        set matches winner to false
#        set matches round_no to 1
        self.matches.each { |match| 
            match.winner=false;
            match.round_no=1; 
            match.save;
        }
    end

end