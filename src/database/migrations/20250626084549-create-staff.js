"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("staff", {
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Email address required" },
          notEmpty: { msg: "Email can't be empty" },
          isEmail: { msg: "Invalid email address" },
        },
      },
      role: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["admin", "staff", "HR", "accountant", "superadmin"],
        defaultValue: "staff",
      },
      staffId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      voucherTypeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "voucherTypes",
          key: "voucherTypeId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      OTP: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9]{6}$/,
            msg: "OTP must be a 6-digit number",
          },
        },
      },
      OTPExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isDate: { msg: "OTP Expiry must be a valid date" },
        },
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        // defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        // defaultValue: Sequelize.fn("NOW"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("staff");
  },
};
