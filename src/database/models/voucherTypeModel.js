"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VoucherType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VoucherType.hasMany(models.Voucher, {
        foreignKey: "voucherTypeId",
        as: "voucher",
      });
      VoucherType.hasMany(models.VisitorVoucher, {
        foreignKey: "voucherTypeId",
        as: "visitorVouchers",
      });
      VoucherType.hasMany(models.Staff, {
        foreignKey: "voucherTypeId",
        as: "staff",
      });
    }
  }
  VoucherType.init(
    {
      voucherTypeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["regular", "special"],
        validate: {
          notNull: { msg: "Voucher type name is required" },
          notEmpty: { msg: "Voucher type name can't be empty" },
        },
      },

      voucherCost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Cost is required" },
          notEmpty: { msg: "Cost can't be empty" },
          isFloat: { msg: "Cost must be a valid number" },
          min: {
            args: [0],
            msg: "Cost must be greater than or equal to 0",
          },
        },
      },
      voucherWorth: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { msg: "Worth is required" },
          notEmpty: { msg: "Worth can't be empty" },
          isFloat: { msg: "Worth must be a valid number" },
          min: {
            args: [0],
            msg: "Worth must be greater than or equal to 0",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "VoucherType",
      tableName: "voucherTypes",
      paranoid: true, // Enables soft deletes
    }
  );
  return VoucherType;
};
