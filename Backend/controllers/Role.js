// Importing necessary modules and models
import Role from "../models/RoleModel.js";

// RoleController contains methods for handling operations on Role
export const RoleController = {
  // Method to retrieve all Role records
  getAllRole: async (req, res) => {
    try {
      // Fetch all Role records with specific attributes
      const roles = await Role.findAll({
        attributes: ["id", "name", "slug", "createdAt"],
      });
      // Return the records
      res.status(200).json(roles);
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving roles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve a Role by its ID
  getRoleById: async (req, res) => {
    const { id } = req.params;
    try {
      // Fetch a single Role record by its ID with specific attributes
      const role = await Role.findOne({
        attributes: ["name", "slug"],
        where: { id },
      });
      // Check if the record exists
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      // Return the record
      res.status(200).json(role);
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to create a new Role record
  createRole: async (req, res) => {
    try {
      // Create a new Role record with the provided data
      const role = await Role.create(req.body);
      // Return the created record
      res.status(201).json(role);
    } catch (error) {
      // Log and handle errors
      console.error("Error creating role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to update an existing Role record by its ID
  updateRole: async (req, res) => {
    const { id } = req.params;
    const { name, slug } = req.body;
    try {
      // Fetch the Role record by its ID
      const role = await Role.findOne({
        where: { id },
      });
      // Check if the record exists
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      // Update the record with the provided data
      await role.update({ name, slug });
      // Return success message
      res.status(200).json({ message: "Role updated successfully" });
    } catch (error) {
      // Log and handle errors
      console.error("Error updating role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to delete a Role record by its ID
  deleteRole: async (req, res) => {
    const { id } = req.params;
    try {
      // Fetch the Role record by its ID
      const role = await Role.findOne({
        where: { id },
      });
      // Check if the record exists
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      // Delete the record
      await role.destroy();
      // Return success message
      res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
      // Log and handle errors
      console.error("Error deleting role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
