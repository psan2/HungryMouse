class Addscores < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :total_wins, :integer, :default => 0
    add_column :players, :total_lost, :integer, :default => 0
  end
end
