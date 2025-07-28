"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WalletTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WalletTransaction.belongsTo(models.Staff, {
        foreignKey: "userId",
        as: "staff",
      });
    }
  }
  WalletTransaction.init(
    {
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "User ID is required" },
          notEmpty: { msg: "User ID can't be empty" },
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "Amount is required" },
          notEmpty: { msg: "Amount can't be empty" },
          isDecimal: { msg: "Amount must be a decimal number" },
        },
      },
      transactionType: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["credit", "debit"],
        validate: {
          notNull: { msg: "Transaction type is required" },
          notEmpty: { msg: "Transaction type can't be empty" },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "WalletTransaction",
      tableName: "walletTransactions",
      paranoid: true,
    }
  );
  return WalletTransaction;
};
