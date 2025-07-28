"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.Staff, {
        foreignKey: "userId",
        as: "staff",
      });
    }
  }
  Wallet.init(
    {
      walletId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          notNull: { msg: "Balance is required" },
          isDecimal: { msg: "Balance must be a decimal number" },
        },
      },
    },
    {
      sequelize,
      modelName: "Wallet",
      tableName: "wallets",
      paranoid: true, // Enables soft deletes
    }
  );
  return Wallet;
};
