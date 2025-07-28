"use strict";

const { or } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("orders", {
      orderId: {
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
      orderCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      orderQrcode: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      visitorVoucherId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "visitorVouchers",
          key: "vistorVoucherId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      orderValue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      orderStatus: {
        type: Sequelize.ENUM("pending", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      belongsTo: {
        type: Sequelize.ENUM,
        values: ["staff", "visitor"],
        defaultValue: "staff",
        allowNull: false,
      },
      noOfVouchers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      vendorId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "vendors",
          key: "userId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("orders");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_orders_orderStatus";'
    );
  },
};
