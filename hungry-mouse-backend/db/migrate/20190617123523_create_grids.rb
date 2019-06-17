class CreateGrids < ActiveRecord::Migration[5.2]
  def change
    create_table :grids do |t|
      t.references :game
      t.integer :x_pos
      t.integer :y_pos 
      t.timestamps
    end
  end
end
