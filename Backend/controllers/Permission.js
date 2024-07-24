// Importing necessary model
import Permission from "../models/PermissionModel.js";

// permissionController contains methods for handling operations on Permission
export const permissionController = {
  // Method to retrieve all Permission records
  async getAllPermissions(req, res) {
    try {
      // Fetch all Permission records
      const permissions = await Permission.findAll();
      // Return the records
      res.status(200).json(permissions);
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving permissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve a Permission by its ID
  async getPermissionById(req, res) {
    const { id } = req.params;
    try {
      // Fetch a single Permission record by its ID
      const permission = await Permission.findByPk(id);
      // Check if the record exists
      if (!permission) {
        return res.status(404).json({ error: "Permission not found" });
      }
      // Return the record
      res.status(200).json(permission);
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving permission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve Permissions grouped by resource and action
  async getPermissionByResourceAndAction(req, res) {
    try {
      // Fetch all Permission records
      const permissions = await Permission.findAll();
      // Group permissions by resource and action
      const groupedPermissions = permissions.reduce((acc, permission) => {
        const { resource, action } = permission;
        if (!acc[resource]) {
          acc[resource] = [];
        }
        acc[resource].push(action);
        return acc;
      }, {});
      // Return the grouped permissions
      res.status(200).json(groupedPermissions);
    } catch (error) {
      // Log and handle errors
      console.error("Error grouping permissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to create a new Permission record
  async createPermission(req, res) {
    const { resource, action, description } = req.body;
    try {
      // Create a new Permission record with the provided data
      const newPermission = await Permission.create({ resource, action, description });
      // Return the created record
      res.status(201).json(newPermission);
    } catch (error) {
      // Log and handle errors
      console.error("Error creating permission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to update an existing Permission record by its ID
  async updatePermission(req, res) {
    const { id } = req.params;
    const { resource, action, description } = req.body;
    try {
      // Fetch the Permission record by its ID
      const permission = await Permission.findByPk(id);
      // Check if the record exists
      if (!permission) {
        return res.status(404).json({ error: "Permission not found" });
      }
      // Update the record with the provided data
      await permission.update({ resource, action, description });
      // Return the updated record
      res.status(200).json(permission);
    } catch (error) {
      // Log and handle errors
      console.error("Error updating permission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to delete a Permission record by its ID
  async deletePermission(req, res) {
    const { id } = req.params;
    try {
      // Fetch the Permission record by its ID
      const permission = await Permission.findByPk(id);
      // Check if the record exists
      if (!permission) {
        return res.status(404).json({ error: "Permission not found" });
      }
      // Delete the record
      await permission.destroy();
      // Return success message
      res.status(200).json({ message: "Permission deleted successfully" });
    } catch (error) {
      // Log and handle errors
      console.error("Error deleting permission:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
