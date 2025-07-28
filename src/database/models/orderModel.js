"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Staff, {
        foreignKey: "userId",
        as: "staff",
      });
      Order.hasMany(models.Voucher, {
        foreignKey: "orderId",
        as: "vouchers",
      });
      Order.belongsTo(models.VisitorVoucher, {
        foreignKey: "visitorVoucherId",
        as: "visitorVoucher",
      });
      Order.belongsTo(models.Vendor, {
        foreignKey: "vendorId",
        as: "vendor",
      });
    }
  }
  Order.init(
    {
      orderId: {
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
          notNull: { msg: "Staff ID is required" },
          notEmpty: { msg: "Staff ID can't be empty" },
        },
      },
      orderCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Order code is required" },
          notEmpty: { msg: "Order code can't be empty" },
        },
      },
      orderQrcode: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      visitorVoucherId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      orderValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Order value is required" },
          isFloat: { msg: "Order value must be a number" },
          min: 700.0,
        },
      },
      orderStatus: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          notNull: { msg: "Order status is required" },
          isIn: {
            args: [["pending", "completed", "cancelled"]],
            msg: "Order status must be one of 'pending', 'completed', or 'cancelled'",
          },
        },
      },
      belongsTo: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ["staff", "visitor"],
        defaultValue: "staff",
      },
      noOfVouchers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          notNull: { msg: "Number of vouchers is required" },
          isInt: { msg: "Number of vouchers must be an integer" },
          min: 1,
        },
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      paranoid: true,
    }
  );

  return Order;
};
