class Food < ApplicationRecord
    belongs_to :match
    has_one :player, through: :match
    has_one :game, through: :match
    has_many :food_grids

    def set_position
        self.food_grids.destroy_all;
        return_array = [];
        x_position=x_pos 
        y_position=y_pos
        if self.vertical 
            if self.y_pos+self.item_length <= self.game.qty_rows
                self.item_length.times do 
                    return_array << FoodGrid.create(food_id:self.id, x_pos:x_position, y_pos:y_position)
                    y_position+=1
                end
            end            
        else
            if self.x_pos+self.item_length <= self.game.qty_columns
                self.item_length.times do 
                   return_array<<FoodGrid.create(food_id:self.id, x_pos:x_position, y_pos:y_position)
                    x_position+=1
                end 
            end 
        end
        return_array
    end
end
