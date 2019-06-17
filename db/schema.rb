# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_06_17_123838) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "food_grids", force: :cascade do |t|
    t.integer "grid_id"
    t.integer "food_id"
    t.boolean "nibble"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "foods", force: :cascade do |t|
    t.string "match_id"
    t.string "name"
    t.integer "length"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "games", force: :cascade do |t|
    t.integer "qty_players"
    t.integer "qty_columns"
    t.integer "qty_rows"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "grids", force: :cascade do |t|
    t.integer "game_id"
    t.integer "x_pos"
    t.integer "y_pos"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "matches", force: :cascade do |t|
    t.integer "player_id"
    t.integer "game_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "players", force: :cascade do |t|
    t.string "CreatePlayers"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
