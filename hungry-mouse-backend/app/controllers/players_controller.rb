class PlayersController < ApplicationController

    def index
        players = Player.all 
        render json: players
    end 

    def show
        player = Player.find(params[:id] )
        render json: player,
            include: [ :matches ]
    end

    def update
        player=Player.find(params[:player_id]);
        player.name=params[:name]
        player.save;
        render json: player
    end
  
end