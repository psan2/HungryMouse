class Addlosercolumn < ActiveRecord::Migration[5.2]
  def change
    add_column :matches, :loser, :boolean, :default => false
  end
end
