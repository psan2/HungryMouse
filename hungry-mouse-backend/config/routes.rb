Rails.application.routes.draw do
  resources :games
  resources :matches
  resources :players
  resources :leaderboards
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post "/bite", to: "matches#bite"

end
