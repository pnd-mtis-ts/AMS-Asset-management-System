import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const FixedGroup = db.define(
  "FixedGroup",
  {
    AccNo: {
      type: DataTypes.STRING(15),
      // primaryKey: true,
      allowNull: false,
    },
    CodeGR: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    DepAcc: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    AccAct: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    AccPc: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    AccAcc: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    Gol: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    DepMethod: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    UsefulLife: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Decrease: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Remark: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    IDNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "FixedGroup",
    timestamps: false,
    hooks: {
      beforeCreate: async (fixedGroup) => {
        const firstLetter = fixedGroup.Name.charAt(0).toUpperCase();
        let uniqueCode;
        let isUnique = false;

        while (!isUnique) {
          const randomTwoDigits = Math.floor(10 + Math.random() * 90); // Generates a random two-digit number
          uniqueCode = `${firstLetter}${randomTwoDigits}`;

          const existingGroup = await FixedGroup.findOne({ where: { CodeGR: uniqueCode } });
          if (!existingGroup) {
            isUnique = true;
          }
        }

        fixedGroup.CodeGR = uniqueCode;
      },
    },
  }
);

export default FixedGroup;
