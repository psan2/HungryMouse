class Game < ApplicationRecord

    has_many :matches
    has_many :players, through: :matches
    has_many :foods, through: :matches
    has_many :food_grids, through: :foods
    has_many :bites, through: :matches

    def initialise
# Set the game up so a person can start positioning their items
#   This means removing data from the shots table
#   resetting the won item on matches and the eaten item on foods


#        set foods eaten to false  and remove the food grids
        self.foods.each { |food|
            food.eaten=false;
            food.x_pos=nil,
            food.y_pos=nil,
            food.food_grids.delete_all
            food.save;
        }

#        set matches winner to false
#        set matches round_no to 1
        self.matches.each { |match|
            match.winner=false;
            match.loser=false;
            match.round_no=1;
            match.bites.destroy_all
            match.save;
        }

# Now position each AI players pieces, randomly
        ai_food.each { |food|
            counter=0 # This is a safety measure to prevent an infinit loop
            while ( position_food(food).length==0 || counter > 5) do
                counter+=1
            end
        }

    end

    def position_food( food ) 
# Do the processing for each food element that is randomly positioned
        food.vertical=rand(2);
        if food.vertical
            x_range=self.qty_columns
            y_range=self.qty_rows-food.item_length
        else
            x_range=self.qty_columns-food.item_length
            y_range=self.qty_rows
        end
        food.x_pos=rand(x_range) + 1
        food.y_pos=rand(y_range) + 1
        food.save
        food.position
    end 

    def ai_food
        self.foods.select {|f| f.player.ai==true}
    end

    def winners
        matches.select {|match| match.winner==true}
    end

    def losers
        matches.select {|match| match.loser==true}
    end

    def inplay
        matches.select {|match| match.loser==false && match.winner==false}
    end

    def player_hash( match )

        player_hash={ player:match.player.name,
            round:match.round_no,
            bites:match.bites.length,
            food: food_array(match) }

    end

    def  food_array( match )

        return_array = []

        match.foods.each {|food|

            if food.x_pos==nil
                positioned=false
            else
                positioned=true
            end

            return_array << {food_id:food.id,
                    food:food.name,
                    length:food.item_length,
                    eaten:food.eaten,
                    positioned:positioned,
                    nibbled: food.food_grids.select {|fg| fg.bite==true }.length
                }
        }

        return_array

    end

    def status
#  Returns the current status of all of the players in this game
        game_hash = {
            game_id:id,
            qty_players:qty_players,
            qty_columns:qty_columns,
            qty_rows:qty_rows,
            winners:[], # The people who have one ... in theory could be more than 1 in a multi multi player game
            losers:[], # Those that have lost ... valid in a multi>2 player game
            inplay:[] # Those that are currently in play
        }

        winners.each { |match| game_hash[:winners] << player_hash( match ) }
        losers.each { |match| game_hash[:losers] << player_hash( match ) }
        inplay.each { |match| game_hash[:inplay] << player_hash( match ) }

        return game_hash

    end

end