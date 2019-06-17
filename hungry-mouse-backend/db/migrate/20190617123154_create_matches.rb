class CreateMatches < ActiveRecord::Migration[5.2]
  def change
    create_table :matches do |t|
      t.references :player
      t.references :game
      t.timestamps
    end
  end
end
