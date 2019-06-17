class CreateFoodGrids < ActiveRecord::Migration[5.2]
  def change
    create_table :food_grids do |t|
      t.integer :grid_id
      t.integer :food_id
      t.boolean :nibble
      t.timestamps
    end
  end
end
