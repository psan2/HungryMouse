class Food < ApplicationRecord
    belongs_to :match
    has_one :player, through: :match
    has_one :game, through: :match
    has_many :food_grids

    def reset_position
# Called if the original position was invalid
        self.reload;
        self.x_pos=nil;
        self.y_pos=nil;
        self.eaten=false;
        self.food_grids.destroy_all;
        self.save;
    end

    def other_foods
        self.match.foods.select {|food|food.id!=self.id}.each {|food| }
    end

    def valid_position?(x_position, y_position)
# If the position is already taken by another placement for this match, return false
        !(other_foods.select{|of| of.food_grids.where(["food_grids.x_pos=? and food_grids.y_pos=?", x_position, y_position] ).length > 0 }.length > 0)
    end

    # Call to solidify the position of the food item, creating the grid that can get eaten
    def position

        return_array = [];
        x_position=x_pos;
        y_position=y_pos;

        if self.vertical
            if self.y_pos+self.item_length <= self.game.qty_rows + 1
                self.item_length.times do
                    if !valid_position?(x_position, y_position)
                        reset_position
                        return []
                    end                        
                    return_array << FoodGrid.create(food_id:self.id, x_pos:x_position, y_pos:y_position, bite:false)
                    y_position+=1
                end
            end
        else
            if self.x_pos+self.item_length <= self.game.qty_columns + 1
                self.item_length.times do
                    if !valid_position?(x_position, y_position)
                        reset_position
                        return [] 
                    end
                   return_array<<FoodGrid.create(food_id:self.id, x_pos:x_position, y_pos:y_position, bite:false)
                    x_position+=1
                end
            end
        end

        return_array

    end

end