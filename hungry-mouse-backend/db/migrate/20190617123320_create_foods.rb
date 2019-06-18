class CreateFoods < ActiveRecord::Migration[5.2]
  def change
    create_table :foods do |t|
      t.references :match
      t.string :name
      t.integer :item_length
      t.boolean :vertical
      t.integer :x_pos
      t.integer :y_pos
      t.timestamps
    end
  end
end
