import jwt from "jsonwebtoken";
import Permission from "../models/PermissionModel.js";
import RolePermission from "../models/RolePermissionModel.js";
import Users from "../models/UserModel.js";
import UserRole from "../models/UserRoleModel.js";

export const verifyUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({ msg: "Token is required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });

    try {
      const foundUser = await Users.findByPk(user.id);
      if (!foundUser) return res.status(404).json({ msg: "User not found" });
      req.user = foundUser;
      next();
    } catch (error) {
      console.error("Error verifying user:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  });
};

export const verifyRoleAndPermission = (resource, action) => async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;

    const permission = await Permission.findOne({
      where: {
        resource: resource,
        action: action,
      },
    });

    if (!permission) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const userRoles = await UserRole.findAll({
      where: {
        userId: userId,
      },
    });

    for (const userRole of userRoles) {
      const rolePermission = await RolePermission.findOne({
        where: {
          roleId: userRole.roleId,
          permissionId: permission.id,
        },
      });
      if (rolePermission) {
        return next();
      }
    }

    return res.status(403).json({ msg: "Forbidden" });
  } catch (error) {
    console.error("Error verifying role and permission:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
