const { Voucher, Holiday } = require("../database/models");
const { Op } = require("sequelize");
const adminDashboardService = require("./adminDashboard");
const { v4: uuidv4 } = require("uuid");

async function getWorkingDaysOfCurrentWeek() {
  const today = new Date();
  const day = today.getDay();

  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  const workingDays = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    workingDays.push(date.toISOString().split("T")[0]);
  }
  const holidays = await checkingHoliday(workingDays);

  return workingDays.filter((day) => !holidays.includes(day));
}

const checkingHoliday = async (workingDays) => {
  const holidays = await Holiday.findAll({
    attributes: ["date"],
    where: {
      date: {
        [Op.in]: workingDays,
      },
    },
  });
  return holidays.map((holiday) => holiday.date.toISOString().split("T")[0]);
};

exports.createWeeklyVouchers = async () => {
  try {
    // const allWorkingDays = getWorkingDaysOfCurrentWeek();
    // const holidays = await checkingHoliday(allWorkingDays);

    // const workingDays = allWorkingDays.filter((day) => !holidays.includes(day));
    const workingDays = await getWorkingDaysOfCurrentWeek();

    if (workingDays.length === 0) {
      throw new Error("No working days this week. Happy holiday to ya'll!");
    }

    const users = await adminDashboardService.getAllUsers();

    if (users.length === 0) {
      throw new Error("No active users found.");
    }

    const existingVouchers = await Voucher.findAll({
      where: {
        userId: {
          [Op.in]: users.map((u) => u.userId),
        },
        issuedAt: {
          [Op.in]: workingDays.map((d) => new Date(d)),
        },
      },
    });

    const existingMap = new Map();
    for (const voucher of existingVouchers) {
      const userId = voucher.userId;
      const dateStr = voucher.issuedAt.toISOString().split("T")[0];
      if (!existingMap.has(userId)) {
        existingMap.set(userId, new Set());
      }
      existingMap.get(userId).add(dateStr);
    }

    const vouchersToCreate = [];

    for (const user of users) {
      const alreadyIssuedDates = existingMap.get(user.userId) || new Set();

      for (const day of workingDays) {
        if (!alreadyIssuedDates.has(day)) {
          vouchersToCreate.push({
            voucherId: uuidv4(),
            voucherTypeId: user.voucherTypeId,
            userId: user.userId,
            status: "active",
            issuedAt: new Date(day),
          });
        }
      }
    }

    if (vouchersToCreate.length > 0) {
      await Voucher.bulkCreate(vouchersToCreate, {
        ignoreDuplicates: true,
      });
      return { message: "Weekly vouchers created successfully." };
    } else {
      return { message: "No new vouchers to create." };
    }
  } catch (error) {
    throw new Error("Error creating weekly vouchers: " + error.message);
  }
};

exports.invalidateVoucher = async () => {
  const workingDays = await getWorkingDaysOfCurrentWeek();
  console.log("Invalidating vouchers for working days:", workingDays);

  const [count] = await Voucher.update(
    { status: "expired" },
    {
      where: {
        issuedAt: {
          [Op.in]: workingDays.map((d) => new Date(d)),
        },
        status: "active",
        isPurchased: false,
      },
    }
  );

  return { message: `${count} vouchers invalidated successfully.` };
};
