import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Role from "./RoleModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const UserRole = db.define(
  "UserRole",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "role",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    tableName: "user_role",
    timestamps: false,
  }
);

UserRole.belongsTo(Users, { foreignKey: "userId" });
UserRole.belongsTo(Role, { foreignKey: "roleId" });

export default UserRole;
