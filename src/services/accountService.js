const {
  Vendor,
  Voucher,
  VoucherType,
  WalletTransaction,
} = require("../database/models");
const AppError = require("../utils/appError");
const moment = require("moment");
const { Op, fn, col } = require("sequelize");

exports.getTransactionsSummary = async (req) => {
  try {
    let { startDate, endDate, month, startMonth, endMonth, currentWeek } =
      req.query;
    let rangeStart, rangeEnd;

    if (month) {
      const parsedMonth = moment().month(month).startOf("month");
      if (!parsedMonth.isValid()) {
        throw new AppError("Invalid month Value", 400);
      }
      rangeStart = parsedMonth.toDate();
      rangeEnd = parsedMonth.endOf("month").toDate();
    } else if (startMonth && endMonth) {
      const parsedStart = moment().month(startMonth).startOf("month");
      const parsedEnd = moment().month(endMonth).endOf("month");
      if (!parsedStart.isValid() || !parsedEnd.isValid()) {
        throw new AppError("Invalid startMonth or endMonth", 400);
      }
      rangeStart = parsedStart.toDate();
      rangeEnd = parsedEnd.toDate();
    } else if (currentWeek === "true") {
      rangeStart = moment().startOf("week").toDate();
      rangeEnd = moment().endOf("week").toDate();
    } else if (startDate && endDate) {
      rangeStart = moment(startDate).startOf("day").toDate();
      rangeEnd = moment(endDate).endOf("day").toDate();
    } else {
      rangeStart = moment().startOf("week").toDate();
      rangeEnd = moment().endOf("week").toDate();
    }

    const transactions = await WalletTransaction.findAll({
      where: {
        transactionDate: {
          [Op.between]: [rangeStart, rangeEnd],
        },
      },
      attributes: [
        "transactionType",
        [fn("SUM", col("amount")), "totalAmount"],
        [fn("COUNT", col("transactionId")), "count"],
      ],
      group: ["transactionType"],
      raw: true,
    });

    return {
      message: `Transactions summary from ${moment(rangeStart).format(
        "YYYY-MM-DD"
      )} to ${moment(rangeEnd).format("YYYY-MM-DD")}`,
      data: transactions,
    };
  } catch (error) {
    console.error("Error getting transaction summary:", error);
    throw new AppError("Error getting transaction summary", 500);
  }
};

exports.getNumberOfRedeemedVouchers = async (req) => {
  const {
    date,
    startDate,
    endDate,
    range,
    today,
    yesterday,
    currentWeek,
    lastWeek,
    month,
    year,
  } = req.query;

  let where = {
    status: "redeemed",
  };

  let fromDate, toDate;

  if (date) {
    fromDate = moment(date, "YYYY-MM-DD").startOf("day").toDate();
    toDate = moment(date, "YYYY-MM-DD").endOf("day").toDate();
  } else if (startDate && endDate) {
    fromDate = moment(startDate, "YYYY-MM-DD").startOf("day").toDate();
    toDate = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();
  } else if (today) {
    fromDate = moment().startOf("day").toDate();
    toDate = moment().endOf("day").toDate();
  } else if (yesterday) {
    fromDate = moment().subtract(1, "day").startOf("day").toDate();
    toDate = moment().subtract(1, "day").endOf("day").toDate();
  } else if (currentWeek) {
    fromDate = moment().startOf("isoWeek").toDate();
    toDate = moment().endOf("isoWeek").toDate();
  } else if (lastWeek) {
    fromDate = moment().subtract(1, "week").startOf("isoWeek").toDate();
    toDate = moment().subtract(1, "week").endOf("isoWeek").toDate();
  } else if (range) {
    fromDate = moment().subtract(Number(range), "days").startOf("day").toDate();
    toDate = moment().endOf("day").toDate();
  } else if (month && year) {
    fromDate = moment(`${year}-${month}-01`, "YYYY-MM-DD")
      .startOf("month")
      .toDate();
    toDate = moment(fromDate).endOf("month").toDate();
  } else {
    fromDate = moment().startOf("isoWeek").toDate();
    toDate = moment().endOf("isoWeek").toDate();
  }

  if (fromDate && toDate) {
    where.redeemedAt = {
      [Op.gte]: fromDate,
      [Op.lte]: toDate,
    };
  }

  const redeemedGrouped = await Voucher.findAll({
    where,
    attributes: [
      "voucherTypeId",
      [fn("COUNT", col("Voucher.voucherTypeId")), "count"],
      [fn("SUM", col("voucherType.voucherWorth")), "totalValue"],
    ],
    include: [
      {
        model: VoucherType,
        as: "voucherType",
        attributes: ["name", "voucherWorth"],
      },
    ],
    group: [
      "Voucher.voucherTypeId",
      "voucherType.name",
      "voucherType.voucherWorth",
    ],
    raw: true,
    nest: true,
  });

  const data = {
    from: fromDate ? moment(fromDate).format("YYYY-MM-DD") : null,
    to: toDate ? moment(toDate).format("YYYY-MM-DD") : null,
    breakdown: redeemedGrouped.map((item) => ({
      type: item.voucherType.name,
      value: item.voucherType.voucherWorth,
      count: parseInt(item.count),
      total: parseFloat(item.totalValue),
    })),
  };
  data.totalValueOfRedeemedVoucher = data.breakdown.reduce(
    (acc, val) => acc + val.total,
    0
  );
  return data;
};

exports.voucherPurchaseDetails = async (req) => {
  const {
    date,
    startDate,
    endDate,
    range,
    today,
    yesterday,
    currentWeek,
    lastWeek,
    month,
    year,
  } = req.query;

  const where = {};
  let fromDate, toDate;

  // 1. Handle all time filters
  if (date) {
    fromDate = moment(date, "YYYY-MM-DD").startOf("day").toDate();
    toDate = moment(date, "YYYY-MM-DD").endOf("day").toDate();
  } else if (startDate && endDate) {
    fromDate = moment(startDate, "YYYY-MM-DD").startOf("day").toDate();
    toDate = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();
  } else if (today) {
    fromDate = moment().startOf("day").toDate();
    toDate = moment().endOf("day").toDate();
  } else if (yesterday) {
    fromDate = moment().subtract(1, "day").startOf("day").toDate();
    toDate = moment().subtract(1, "day").endOf("day").toDate();
  } else if (currentWeek) {
    fromDate = moment().startOf("isoWeek").toDate();
    toDate = moment().endOf("isoWeek").toDate();
  } else if (lastWeek) {
    fromDate = moment().subtract(1, "week").startOf("isoWeek").toDate();
    toDate = moment().subtract(1, "week").endOf("isoWeek").toDate();
  } else if (range) {
    fromDate = moment().subtract(Number(range), "days").startOf("day").toDate();
    toDate = moment().endOf("day").toDate();
  } else if (month && year) {
    fromDate = moment(`${year}-${month}-01`, "YYYY-MM-DD")
      .startOf("month")
      .toDate();
    toDate = moment(fromDate).endOf("month").toDate();
  } else {
    fromDate = moment().startOf("isoWeek").toDate();
    toDate = moment().endOf("isoWeek").toDate();
  }

  if (fromDate && toDate) {
    where.issuedAt = {
      [Op.gte]: fromDate,
      [Op.lte]: toDate,
    };
  }

  // 2. Fetch voucher breakdown by type
  const vouchers = await Voucher.findAll({
    where,
    attributes: [
      "voucherTypeId",
      "isPurchased",
      "status",
      [fn("COUNT", col("Voucher.voucherId")), "count"],
    ],
    include: [
      {
        model: VoucherType,
        as: "voucherType",
        attributes: ["name"],
      },
    ],
    group: [
      "Voucher.voucherTypeId",
      "voucherType.name",
      "isPurchased",
      "status",
    ],
    raw: true,
    nest: true,
  });

  // 3. Transform the result into a summary
  const summary = {};

  for (const item of vouchers) {
    const typeName = item.voucherType.name;

    if (!summary[typeName]) {
      summary[typeName] = {
        voucherTypeId: item.voucherTypeId,
        name: typeName,
        totalAllocated: 0,
        purchased: 0,
        notPurchased: 0,
        redeemed: 0,
      };
    }

    const count = parseInt(item.count);
    summary[typeName].totalAllocated += count;

    if (item.isPurchased) summary[typeName].purchased += count;
    else summary[typeName].notPurchased += count;

    if (item.status === "redeemed") summary[typeName].redeemed += count;
  }

  return {
    data: Object.values(summary),
  };
};
