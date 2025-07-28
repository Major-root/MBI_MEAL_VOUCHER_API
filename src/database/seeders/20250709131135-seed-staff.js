"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash("Developer", 12);

    await queryInterface.bulkInsert("staff", [
      {
        userId: "032e0eeb-6240-4d8d-9f78-3fef18d71786",
        password: hashedPassword,
        firstName: "Stanley",
        lastName: "Kelechi",
        email: "agbostanley712@gmail.com",
        role: "staff",
        staffId: 300,
        voucherTypeId: "461f5167-aed5-4343-beb9-92ac7a015396",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: "bc9ea982-ecda-4805-9505-2c8dbaf720f9",
        password: hashedPassword,
        firstName: "Developer",
        lastName: "Bin",
        email: "bashnwa042@gmail.com",
        role: "admin",
        staffId: 89,
        voucherTypeId: "8b3812ac-7f50-4a8e-8060-65181c471ee0",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: "d1f8c5b2-3e4f-4b6a-9c0e-7f8c5b2e4d6a",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        role: "accountant",
        staffId: 101,
        voucherTypeId: "461f5167-aed5-4343-beb9-92ac7a015396",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: "e2f8c5b2-3e4f-4b6a-9c0e-7f8c5b2e4d6b",
        password: hashedPassword,
        firstName: "Jane",
        lastName: "Smith",
        email: "janesmith@gmail.com",
        role: "staff",
        staffId: 102,
        voucherTypeId: "461f5167-aed5-4343-beb9-92ac7a015396",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: "e2f8c5b2-3e4f-4b6a-9c0e-7f8c5b2e5d6b",
        password: hashedPassword,
        firstName: "murphy",
        lastName: "Okwudili",
        email: "murphyokwudili@gmail.com",
        role: "superadmin",
        staffId: 103,
        voucherTypeId: "8b3812ac-7f50-4a8e-8060-65181c471ee0",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add the rest similarly...
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("staff", null, {});
  },
};
