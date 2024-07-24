import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import AssetRelocation from "./AssetRelocationModel.js";
import Fixed from "./FixedModel.js";
import Location from "./LocationModel.js";

const { DataTypes } = Sequelize;

const AssetRelocationItem = db.define(
  "AssetRelocationItem",
  {
    RelocationID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    AssetRelocation_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "AssetRelocation",
        key: "ID",
      },
    },
    FixedIDNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Fixed",
        key: "FixedIDNo",
      },
    },
    PreviousLocation: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: "Location",
        key: "LocID",
      },
    },
    NewLocation: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: "Location",
        key: "LocID",
      },
    },
    PreviousEmployeeResponsible: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    NewEmployeeResponsible: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    RelocationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    tableName: "AssetRelocationItem",
  }
);

AssetRelocationItem.belongsTo(AssetRelocation, { foreignKey: "AssetRelocation_ID" });
AssetRelocationItem.belongsTo(Fixed, { foreignKey: "FixedIDNo" });
AssetRelocation.hasMany(AssetRelocationItem, { foreignKey: "AssetRelocation_ID" });
AssetRelocationItem.belongsTo(Location, { foreignKey: "PreviousLocation", as: "PreviousLocationDetails" });
AssetRelocationItem.belongsTo(Location, { foreignKey: "NewLocation", as: "NewLocationDetails" });

export default AssetRelocationItem;
