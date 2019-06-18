class Playmodifications < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :ai, :boolean, :default => false
    add_column :foods, :eaten, :boolean, :default => false
    add_column :matches, :winner, :boolean, :default => false
    add_column :matches, :round_no, :integer, :default => 1
  end
end
