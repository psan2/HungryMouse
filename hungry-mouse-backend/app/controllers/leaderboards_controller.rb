class LeaderboardsController < ApplicationController

    def index
        leaderboards = Leaderboard.all 
        render json: leaderboards
    end 

    def create
        leaderboard=Leaderboard.create(name:params[:name])
        leaderboards = Leaderboard.all
        render json: leaderboards
    end
  
end