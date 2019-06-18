class GamesController < ApplicationController

    def index
        games = Game.all 
        render json: games
    end 

    def show
        game = Game.find(params[:id] )
        if game
            render json: game
        end
    end

    def update
        game.assign_attributes(student_params)
        if game.valid?
          game.save
          render json: game
        end
    end
   
  
end