// Import Sequelize models
import Permission from "../models/PermissionModel.js";
import Role from "../models/RoleModel.js";
import RolePermission from "../models/RolePermissionModel.js";

// rolePermissionController contains methods for handling operations on Role-Permission relations
export const rolePermissionController = {
  // Method to create new Role-Permission entries
  async createRolePermission(req, res) {
    const { roleId, permissionId } = req.body;

    // Ensure permissionId is an array
    if (!Array.isArray(permissionId)) {
      return res.status(400).json({ error: "permissionId must be an array" });
    }

    try {
      // Create role-permission entries for each permissionId
      const newRolePermissions = await Promise.all(permissionId.map((id) => RolePermission.create({ roleId, permissionId: id })));

      // Return the created entries
      res.status(201).json(newRolePermissions);
    } catch (error) {
      // Log and handle errors
      console.error("Error creating role permissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve all Role-Permission entries
  async getAllRolePermissions(req, res) {
    try {
      // Fetch all Role-Permission entries with associated Role and Permission attributes
      const rolePermissions = await RolePermission.findAll({
        include: [
          {
            model: Role,
            attributes: ["name"],
          },
          {
            model: Permission,
            attributes: ["resource", "action"],
          },
        ],
      });

      // Return the entries
      res.json(rolePermissions);
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving role permissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve Role-Permission entries by roleId
  async getRolePermissionsById(req, res) {
    const { roleId } = req.params;
    try {
      // Fetch Role-Permission entries by roleId
      const rolePermissions = await RolePermission.findAll({
        where: { roleId },
      });

      // Return the entries
      res.json(rolePermissions);
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving role permissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to update a Role-Permission entry
  async updateRolePermission(req, res) {
    const { roleId, permissionId } = req.params;
    const { newPermissionId } = req.body;
    try {
      // Fetch the Role-Permission entry by roleId and permissionId
      const rolePermission = await RolePermission.findOne({
        where: { roleId, permissionId },
      });

      // Check if the entry exists
      if (!rolePermission) {
        return res.status(404).json({ error: "Role permission not found" });
      }

      // Update the entry with the new permissionId
      await rolePermission.update({ permissionId: newPermissionId });

      // Return the updated entry
      res.json(rolePermission);
    } catch (error) {
      // Log and handle errors
      console.error("Error updating role permission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to delete a Role-Permission entry
  async deleteRolePermission(req, res) {
    const { roleId, permissionId } = req.body;

    // Validate roleId and permissionId
    if (!roleId) {
      return res.status(400).json({ error: "RoleId is required" });
    }
    if (!permissionId) {
      return res.status(400).json({ error: "PermissionId is required" });
    }

    try {
      // Delete the Role-Permission entry
      const deletedRows = await RolePermission.destroy({
        where: { roleId, permissionId },
      });

      // Check if any entry was deleted
      if (deletedRows === 0) {
        return res.status(404).json({ error: "Role permission not found" });
      }

      // Return success message
      res.json({ message: "Role permission deleted successfully" });
    } catch (error) {
      // Log and handle errors
      console.error("Error deleting role permission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
