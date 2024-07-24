import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Permission from "./PermissionModel.js";
import Role from "./RoleModel.js";

const { DataTypes } = Sequelize;

const RolePermission = db.define(
  "role_permission",
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "role",
        key: "id",
      },
    },
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "permission",
        key: "id",
      },
    },
  },
  {
    tableName: "role_permission",
    timestamps: false,
  }
);

RolePermission.belongsTo(Role, { foreignKey: "roleId" });
RolePermission.belongsTo(Permission, { foreignKey: "permissionId" });

export default RolePermission;
