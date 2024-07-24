import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Role = db.define(
  "role",
  {
    name: {
      type: DataTypes.STRING(75),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(75),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "role",
  }
);

export default Role;
