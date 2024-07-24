import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import EntitasBisnis from "./EntitasBisnisModel.js";
import Entity from "./EntityModel.js";
import FixedGroup from "./FixedGroupModel.js";
import Location from "./LocationModel.js";
import Unit from "./UnitModel.js";
const { DataTypes } = Sequelize;

const Fixed = db.define(
  "Fixed",
  {
    FixedIDNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Entity: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      references: {
        model: "Entity",
        key: "Entity",
      },
    },
    FixedAssetName: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    AccNo: {
      type: DataTypes.CHAR(15),
      allowNull: false,
    },
    Currency: {
      type: DataTypes.CHAR(3),
      defaultValue: "IDR",
      allowNull: true,
    },
    FixedNo: {
      type: DataTypes.CHAR(50),
      allowNull: true,
    },
    DateAq: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DateDisp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CostCenterNo: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    ProfitCenterNo: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    LocId: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: "Location",
        key: "LocID",
      },
    },
    IDNoPO: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IDNoPR: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IDNoGR: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "FixedGroup",
        key: "IDNo",
      },
    },
    IDNoEB: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "EntitasBisnis",
        key: "IDNo",
      },
    },
    IDNoPC: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OrderNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    InvNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    PickBill: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    SupplierId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Qty: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 1,
    },
    Pick: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PickGR: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    GRNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Unit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: "Unit",
        key: "Unit",
      },
    },
    Cost: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    SUnit: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    SalVageValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
    SalvageValueORG: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    AccDep: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Pict: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    Remark: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },

    Sqm: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    HolderName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Classification: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Brand: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ChassisNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    EngineNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    RegNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    RegDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    GuaranteeDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    EmpID: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    UserID: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
  },
  { tableName: "Fixed", timestamps: false }
);

Fixed.belongsTo(FixedGroup, { foreignKey: "IDNoGR" });
Fixed.belongsTo(EntitasBisnis, { foreignKey: "IDNoEB" });
Fixed.belongsTo(Entity, { foreignKey: "Entity", as: "EntityRelations" });
Fixed.belongsTo(Location, { foreignKey: "LocId" });
Fixed.belongsTo(Unit, { foreignKey: "Unit", as: "UnitRelations" });

export default Fixed;
