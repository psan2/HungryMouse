class CreateFoodGrids < ActiveRecord::Migration[5.2]
  def change
    create_table :food_grids do |t|
      t.references :food
      t.integer :x_pos
      t.integer :y_pos
      t.boolean :nibble
      t.timestamps
    end
  end
end
