"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("vouchers", {
      voucherId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
        onDelete: "RESTRICT",
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
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        defaultValue: "active",
        values: ["active", "redeemed", "expired", "pending"],
      },
      issuedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      purchasedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      redeemedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      transferredTo: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      isPurchased: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "orders",
          key: "orderId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      vendorId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "vendors",
          key: "userId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      transferred: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      paidOut: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      payoutDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        // defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        // defaultValue: Sequelize.fn('NOW'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("vouchers");
  },
};
