"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert("voucherTypes", [
      {
        voucherTypeId: "461f5167-aed5-4343-beb9-92ac7a015396",
        name: "regular",
        voucherCost: 400,
        voucherWorth: 700,
        createdAt: now,
        updatedAt: now,
      },
      {
        voucherTypeId: "8b3812ac-7f50-4a8e-8060-65181c471ee0",
        name: "special",
        voucherCost: 400,
        voucherWorth: 1000,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("voucherTypes", null, {});
  },
};
