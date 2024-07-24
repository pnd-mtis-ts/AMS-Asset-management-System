// Import Sequelize models
import { Sequelize } from "sequelize";
import Role from "../models/RoleModel.js";
import Users from "../models/UserModel.js";
import UserRole from "../models/UserRoleModel.js";

// UserRoleController contains methods for handling operations on User-Role relations
export const UserRoleController = {
  // Method to create a new User-Role entry
  createUserRole: async (req, res) => {
    try {
      const { userId, roleId } = req.body;
      console.log("Received request to create user role with userId:", userId, "and roleId:", roleId);

      // Validate userId and roleId
      if (!userId || !roleId) {
        console.error("Missing userId or roleId in request body");
        return res.status(400).json({ error: "Missing userId or roleId in request body" });
      }

      // Create the User-Role entry
      const userRole = await UserRole.create({ userId, roleId });
      console.log("User role created:", userRole);

      // Return the created entry
      res.status(201).json({ userRole });
    } catch (error) {
      // Log and handle errors
      console.error("Error creating user role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve all User-Role entries
  getAllUserRoles: async (req, res) => {
    try {
      // Fetch all User-Role entries with associated User and Role attributes
      const userRoles = await UserRole.findAll({
        include: [
          {
            model: Users,
            attributes: ["name"],
          },
          {
            model: Role,
            attributes: ["name"],
          },
        ],
      });

      // Return the entries
      res.status(200).json({ userRoles });
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving all user roles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve User-Role entries by userId
  findOneUserRoleByUserId: async (req, res) => {
    try {
      const userRoles = await UserRole.findAll({
        where: { userId: req.params.userId },
        order: Sequelize.col("userId"),
      });

      // Check if any entries were found
      if (userRoles.length === 0) {
        return res.status(404).json({ error: "No user roles found for the specified user ID" });
      }

      // Return the entries
      res.status(200).json({ userRoles });
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving user roles by user ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve User-Role entries by roleId
  findOneUserRoleByRoleId: async (req, res) => {
    try {
      const userRoles = await UserRole.findAll({
        where: { roleId: req.params.roleId },
        order: Sequelize.col("roleId"),
      });

      // Check if any entries were found
      if (userRoles.length === 0) {
        return res.status(404).json({ error: "No user roles found for the specified role ID" });
      }

      // Return the entries
      res.status(200).json({ userRoles });
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving user roles by role ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to update User-Role entries by userId
  updateUserRoleByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const updatedRows = await UserRole.update(req.body, {
        where: { userId },
      });

      // Check if any entries were updated
      if (updatedRows[0] === 0) {
        return res.status(404).json({ error: "No user roles found for the specified user ID" });
      }

      // Return success message
      res.status(200).json({ message: "User roles updated successfully" });
    } catch (error) {
      // Log and handle errors
      console.error("Error updating user roles by user ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to delete a User-Role entry
  deleteUserRole: async (req, res) => {
    try {
      const { userId, roleId } = req.body;

      // Validate userId and roleId
      if (!userId || !roleId) {
        console.error("Missing userId or roleId in request body");
        return res.status(400).json({ error: "Missing userId or roleId in request body" });
      }

      // Delete the User-Role entry
      const deletedRows = await UserRole.destroy({
        where: { userId, roleId },
      });

      // Check if any entries were deleted
      if (deletedRows === 0) {
        return res.status(404).json({ error: "No user role found for the specified user ID and role ID" });
      }

      // Return success message
      res.status(200).json({ message: "User role deleted successfully" });
    } catch (error) {
      // Log and handle errors
      console.error("Error deleting user role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
