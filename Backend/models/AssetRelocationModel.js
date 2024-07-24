import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import EntitasBisnis from "./EntitasBisnisModel.js";

const { DataTypes } = Sequelize;

const AssetRelocation = db.define(
  "AssetRelocation",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    TransNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    TransDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    TransDesc: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    IDNoEB: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "EntitasBisnis",
        key: "IDNo",
      },
    },
  },
  {
    hooks: {
      async beforeCreate(assetRelocation) {
        try {
          const entitasBisnis = await EntitasBisnis.findByPk(assetRelocation.IDNoEB);
          if (!entitasBisnis) {
            throw new Error("Entitas Bisnis not found");
          }

          const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
          const yearMonth = currentMonth.replace("-", "").slice(2); // Format: YYMM

          // Get the last counter used for the current month
          const lastRelocation = await AssetRelocation.findOne({
            where: {
              TransNo: {
                [Sequelize.Op.like]: `${entitasBisnis.EBCode}/RELOC/${yearMonth}.%`,
              },
            },
            order: [["TransNo", "DESC"]],
          });

          let counter = 1;
          if (lastRelocation) {
            const lastCounter = parseInt(lastRelocation.TransNo.split(".").pop());
            counter = lastCounter + 1;
          }

          assetRelocation.TransNo = `${entitasBisnis.EBCode}/RELOC/${yearMonth}.${String(counter).padStart(4, "0")}`;
        } catch (error) {
          console.error("Error in beforeCreate hook:", error.message);
          throw new Error(error.message);
        }
      },
    },
    timestamps: false,
    tableName: "AssetRelocation",
  }
);

AssetRelocation.belongsTo(EntitasBisnis, { foreignKey: "IDNoEB" });

export default AssetRelocation;
