class CreateShots < ActiveRecord::Migration[5.2]
  def change
    create_table :shots do |t|
      t.references :match
      t.integer :x_pos
      t.integer :y_pos
      t.timestamps
    end
  end
end
