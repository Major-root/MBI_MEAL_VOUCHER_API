"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voucher.belongsTo(models.VoucherType, {
        foreignKey: "voucherTypeId",
        as: "voucherType",
      });
      Voucher.belongsTo(models.Staff, {
        foreignKey: "userId",
        as: "staff",
      });
      Voucher.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
      Voucher.belongsTo(models.Vendor, {
        foreignKey: "vendorId",
        as: "vendor",
      });
    }
  }
  Voucher.init(
    {
      voucherId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      voucherTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "User ID is required" },
          notEmpty: { msg: "User ID can't be empty" },
        },
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["active", "redeemed", "expired", "pending"],
        defaultValue: "active",
        validate: {
          notNull: { msg: "Status is required" },
          notEmpty: { msg: "Status can't be empty" },
        },
      },
      issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      purchasedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      redeemedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      transferredTo: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      isPurchased: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      transferred: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      paidOut: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      payoutDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Voucher",
      tableName: "vouchers",
      paranoid: true, // Enables soft deletes
    }
  );
  return Voucher;
};
