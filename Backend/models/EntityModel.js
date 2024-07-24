import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Entity = db.define(
  "Entity",
  {
    Entity: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
    EntityName: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    City: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Fax: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ZipCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    EmailAddress: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IDNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    KdLama: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    CekPriceLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ReportTo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    ReportToName: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    EntityCat: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    EntityCatName: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    Divisi: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Area: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    EntityCat2011: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    EntityCat2011Name: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    IsCCP: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsGA: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NotActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsSOApp: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsDD: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    DONonSO: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    PrintKasir: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsEditPrice: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsPurchaseInPayreq: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    APInvPartnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Entity",
    timestamps: false,
  }
);

export default Entity;
