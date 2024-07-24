import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Unit = db.define(
  "Unit",
  {
    Unit: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    LastUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    UserID: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    NotActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    IDNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Unit",
    timestamps: false,
  }
);

export default Unit;
