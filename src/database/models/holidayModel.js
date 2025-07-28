"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Holiday extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Holiday.belongsTo(models.Staff, {
        foreignKey: "userId",
        as: "staff",
      });
    }
  }
  Holiday.init(
    {
      holidayId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Holiday date is required" },
          notEmpty: { msg: "Holiday date can't be empty" },
          isDate: { msg: "Must be a valid date" },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Holiday title is required" },
          notEmpty: { msg: "Holiday title can't be empty" },
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Holiday",
      tableName: "holidays",
      paranoid: true, // Enables soft deletes
    }
  );
  return Holiday;
};
