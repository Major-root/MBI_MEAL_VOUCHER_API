"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Staff.hasMany(models.Order, {
        foreignKey: "userId",
        as: "orders",
      });
      Staff.hasOne(models.Wallet, {
        foreignKey: "userId",
        as: "wallets",
      });
      Staff.hasMany(models.WalletTransaction, {
        foreignKey: "userId",
        as: "walletTransactions",
      });
      Staff.hasMany(models.Voucher, {
        foreignKey: "userId",
        as: "vouchers",
      });
      Staff.hasMany(models.VisitorVoucher, {
        foreignKey: "userId",
        as: "visitorVouchers",
      });
      Staff.hasMany(models.Holiday, {
        foreignKey: "userId",
        as: "holidays",
      });
      Staff.hasMany(models.Payment, {
        foreignKey: "userId",
        as: "payments",
      });
      Staff.belongsTo(models.VoucherType, {
        foreignKey: "voucherTypeId",
        as: "voucherType",
      });
    }
  }
  Staff.init(
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Email address required" },
          notEmpty: { msg: "Email can't be empty" },
          isEmail: { msg: "Invalid email address" },
        },
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["admin", "staff", "HR", "accountant", "superadmin"],
        defaultValue: "staff",
        validate: {
          notNull: { msg: "Role is required" },
          notEmpty: { msg: "Role can't be empty" },
        },
      },
      staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Staff ID is required" },
          notEmpty: { msg: "Staff ID can't be empty" },
        },
      },
      voucherTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
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
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "Staff",
      tableName: "staff",
      paranoid: true, // Enables soft deletes
    }
  );
  return Staff;
};
