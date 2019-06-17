class Match < ApplicationRecord
    belongs_to :player
    belongs_to :game
    has_many :foods
end
