class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.integer :qty_players
      t.integer :qty_columns
      t.integer :qty_rows
      t.timestamps
    end
  end
end
