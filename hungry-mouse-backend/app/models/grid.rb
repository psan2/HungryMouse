class Grid < ApplicationRecord
    belongs_to :game
    has_many :food_grids
end
