import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Location = db.define(
  "Location",
  {
    LocID: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    LocationName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    Entity: {
      type: DataTypes.STRING(10),
      allowNull: true,
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
    tableName: "Location",
    timestamps: false,
  }
);

export default Location;
