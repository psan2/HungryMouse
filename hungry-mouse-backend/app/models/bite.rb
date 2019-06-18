class Bite < ApplicationRecord
    belongs_to :match
    has_one :game, through: :match
    has_one :player, through: :match
end
