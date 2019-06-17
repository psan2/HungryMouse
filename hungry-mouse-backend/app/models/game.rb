class Game < ApplicationRecord
    has_many :grids
    has_many :matches
    has_many :players, through: :matches
    has_many :foods, through: :matches
end
