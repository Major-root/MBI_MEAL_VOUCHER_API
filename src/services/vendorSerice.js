const { Vendor, Order, Voucher, VoucherType } = require("../database/models");
const AppError = require("../utils/appError");
const { Op, fn, col, literal } = require("sequelize");
const moment = require("moment");

// add payout column to the voucher col so run migrations mate

exports.getNumberOfRedeemedVouchers = async (req) => {
  const { userId } = req.user;
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
    vendorId: userId,
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
