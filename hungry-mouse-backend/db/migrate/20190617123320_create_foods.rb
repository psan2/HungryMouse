class CreateFoods < ActiveRecord::Migration[5.2]
  def change
    create_table :foods do |t|
      t.references :match
      t.string :name
      t.integer :item_length
      t.timestamps
    end
  end
end
