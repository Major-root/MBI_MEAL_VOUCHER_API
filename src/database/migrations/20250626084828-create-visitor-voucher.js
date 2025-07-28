"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("visitorVouchers", {
      vistorVoucherId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "staff",
          key: "userId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      vistiorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      issuedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      voucherTypeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "voucherTypes",
          key: "voucherTypeId",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "redeemed", "expired"],
        allowNull: false,
        defaultValue: "active",
      },
      redeemedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("visitorVouchers");
  },
};
