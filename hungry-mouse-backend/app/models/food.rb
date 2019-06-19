class Food < ApplicationRecord
    belongs_to :match
    has_one :player, through: :match
    has_one :game, through: :match
    has_many :food_grids

    # Call to solidify the position of the food item, creating the grid that can get eaten
    def position
        self.food_grids.destroy_all;
        self.eaten=false;
        self.save;
        return_array = [];
        x_position=x_pos
        y_position=y_pos
        if self.vertical
            if self.y_pos+self.item_length <= self.game.qty_rows + 1
                self.item_length.times do
                    return_array << FoodGrid.create(food_id:self.id, x_pos:x_position, y_pos:y_position, bite:false)
                    y_position+=1
                end
            end
        else
            if self.x_pos+self.item_length <= self.game.qty_columns + 1
                self.item_length.times do
                   return_array<<FoodGrid.create(food_id:self.id, x_pos:x_position, y_pos:y_position, bite:false)
                    x_position+=1
                end
            end
        end
        return_array
    end
end