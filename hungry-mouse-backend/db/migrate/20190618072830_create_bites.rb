class CreateBites < ActiveRecord::Migration[5.2]
  def change
    create_table :bites do |t|
      t.references :match
      t.integer :x_pos
      t.integer :y_pos
      t.timestamps
    end
  end
end
