class CreateFoodGrids < ActiveRecord::Migration[5.2]
  def change
    create_table :food_grids do |t|
      t.references :grid
      t.references :food
      t.boolean :nibble
      t.timestamps
    end
  end
end
