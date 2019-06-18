class MatchesController < ApplicationController

    def show
        match = Match.find(params[:id] )
        render json: match,
            include: [:foods] 
    end

    def update

        params[:foods].each do |food|
            food=Food.find(food.id)
            food.set_position(food)
        end

        render json: match,
            include: [:foods]

    end

end