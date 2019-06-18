# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Player.destroy_all
Game.destroy_all
Match.destroy_all
Food.destroy_all

computer = Player.create( name:"Computer", ai:true);
player2 = Player.create( name:"2nd player");

game = Game.create(qty_players:2,qty_columns:20,qty_rows:20);

match1 = Match.create(player_id:computer.id, game_id:game.id);
match2 = Match.create(player_id:player2.id, game_id:game.id);

food1 = Food.create(match_id:match1.id, name:"Big cheese", item_length:3);
food2 = Food.create(match_id:match2.id, name:"Big cheese", item_length:3);
food3 = Food.create(match_id:match1.id, name:"Small cheese", item_length:2);
food4 = Food.create(match_id:match2.id, name:"Small cheese", item_length:2);