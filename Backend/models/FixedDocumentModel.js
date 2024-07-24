import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Fixed from "./FixedModel.js";
const { DataTypes } = Sequelize;

const FixedDocument = db.define(
  "FixedDocument",
  {
    DocumentIDNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    NoDocument: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ExpiredDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DocumentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    FixedIDNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Fixed",
        key: "FixedIDNo",
      },
    },
  },
  {
    tableName: "FixedDocument",
    timestamps: false,
  }
);

FixedDocument.belongsTo(Fixed, { foreignKey: "FixedIDNo" });
Fixed.hasMany(FixedDocument, { foreignKey: "FixedIDNo" });

export default FixedDocument;
