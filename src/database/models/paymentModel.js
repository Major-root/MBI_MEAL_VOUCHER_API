"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Staff, {
        foreignKey: "userId",
        as: "staff",
      });
    }
  }
  Payment.init(
    {
      paymentId: {
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
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "Amount is required" },
          isDecimal: { msg: "Amount must be a decimal number" },
        },
      },
      referenceId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Reference ID is required" },
          notEmpty: { msg: "Reference ID can't be empty" },
        },
      },
      paymentService: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["Pending", "Completed", "Failed", "Cancelled"],
        defaultValue: "Pending",
      },
      // currency: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   defaultValue: "NGN",
      // },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      paranoid: true, // Enables soft deletes
    }
  );
  return Payment;
};
