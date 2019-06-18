class Game < ApplicationRecord

    has_many :matches
    has_many :players, through: :matches
    has_many :foods, through: :matches
    has_many :food_grids, through: :foods

end
