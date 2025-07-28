"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash("Developer", 12);

    await queryInterface.bulkInsert("vendors", [
      {
        userId: "d860a039-f8ef-4826-a5dd-5a1d11c2d585",
        password: hashedPassword,
        name: "Idiong ubong",
        email: "agbostanly712@gmail.com",
        phone: "+2348109887523",
        active: true,
        role: "vendor",
        vendorId: 300,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: "bc5528df-9350-4049-8371-494361707cca",
        password: hashedPassword,
        name: "Dwag chef",
        email: "agbostanley@gmail.com",
        phone: "+2348109889523",
        active: true,
        role: "vendor",
        vendorId: 390,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("vendors", null, {});
  },
};
