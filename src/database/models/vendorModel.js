"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Vendor.hasMany(models.Order, {
        foreignKey: "vendorId",
        as: "orders",
      });
      models.Vendor.hasMany(models.Voucher, {
        foreignKey: "vendorId",
        as: "vouchers",
      });
    }
  }
  Vendor.init(
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Vendor name is required" },
          notEmpty: { msg: "Vendor name can't be empty" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Email address is required" },
          notEmpty: { msg: "Email can't be empty" },
          isEmail: { msg: "Invalid email address" },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Phone number is required" },
          notEmpty: { msg: "Phone can't be empty" },
          is: {
            args: /^\+?[1-9]\d{1,14}$/,
            msg: "Invalid phone number format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password can't be empty" },
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      OTP: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9]{6}$/,
            msg: "OTP must be a 6-digit number",
          },
        },
      },
      OTPExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: { msg: "OTP Expiry must be a valid date" },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "vendor",
      },
    },
    {
      sequelize,
      modelName: "Vendor",
      tableName: "vendors",
      paranoid: true, // Enables soft deletes
    }
  );
  return Vendor;
};
