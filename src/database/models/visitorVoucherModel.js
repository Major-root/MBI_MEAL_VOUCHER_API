"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VisitorVoucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VisitorVoucher.belongsTo(models.Staff, {
        foreignKey: "userId",
        as: "staff",
      });
      VisitorVoucher.hasOne(models.Order, {
        foreignKey: "visitorVoucherId",
        as: "order",
      });
      VisitorVoucher.belongsTo(models.VoucherType, {
        foreignKey: "voucherTypeId",
        as: "voucherType",
      });
    }
  }
  VisitorVoucher.init(
    {
      vistorVoucherId: {
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
      vistiorName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Visitor name is required" },
          notEmpty: { msg: "Visitor name can't be empty" },
        },
      },
      issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Issued date is required" },
          isDate: { msg: "Issued date must be a valid date" },
        },
      },
      voucherTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ["active", "redeemed", "expired"],
        defaultValue: "active",
        validate: {
          notNull: { msg: "Status is required" },
          notEmpty: { msg: "Status can't be empty" },
        },
      },
      redeemedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: { msg: "Redeemed date must be a valid date" },
        },
      },
      // validTill: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      //   validate: {
      //     notNull: { msg: "Valid till date is required" },
      //     isDate: { msg: "Valid till date must be a valid date" },
      //   },
      // },
      // numberOfVoucher: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   validate: {
      //     notNull: { msg: "Number of vouchers is required" },
      //     isInt: { msg: "Number of vouchers must be an integer" },
      //     min: {
      //       args: [1],
      //       msg: "Number of vouchers must be at least 1",
      //     },
      //   },
      // },
    },
    {
      sequelize,
      modelName: "VisitorVoucher",
      tableName: "visitorVouchers",
      paranoid: true,
    }
  );
  return VisitorVoucher;
};
