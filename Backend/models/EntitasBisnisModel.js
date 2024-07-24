import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const EntitasBisnis = db.define(
  "EntitasBisnis",
  {
    IDNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    EBCode: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    EBName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    IP: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsOpenCustomer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    Address: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    tableName: "EntitasBisnis",
    timestamps: false,
  }
);

export default EntitasBisnis;
