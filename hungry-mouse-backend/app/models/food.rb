class Food < ApplicationRecord
    belongs_to :match
    has_one :player, through: :match
    has_one :game, through: :match
end
