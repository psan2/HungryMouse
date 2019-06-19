class Addbiteboolean < ActiveRecord::Migration[5.2]
  def change
    add_column :bites, :bite, :boolean, :default=> false
  end
end
