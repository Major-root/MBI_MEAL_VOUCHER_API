"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("vendors", {
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      vendorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
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
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "vendor",
      },
      OTPExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isDate: { msg: "OTP Expiry must be a valid date" },
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("vendors");
  },
};
