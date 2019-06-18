class GamesController < ApplicationController

    def index
        games = Game.all 
        render json: games
    end 

    def show
        game = Game.find(params[:id] )
        render json: game.status
        #,
         #   include: [ game.status]
    end

    def update
        game=Game.find(params[:game_id]);
        game.qty_columns=params[:qty_columns]
        game.qty_rows=params[:qty_rows]
        game.save;
        game.initialise;
        render json: game,
            include: [:matches, :players]
    end   
  
end