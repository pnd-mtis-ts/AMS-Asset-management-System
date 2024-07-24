// Importing necessary modules and models
import { Sequelize } from "sequelize";
import Unit from "../models/UnitModel.js";

// UnitController contains methods for handling operations on Unit
export const UnitController = {
  // Method to retrieve all Unit records
  getAllUnit: async (req, res) => {
    try {
      // Fetch all Unit records with specific attributes
      const response = await Unit.findAll({
        attributes: ["Unit", "NotActive", "IDNo", "Status"],
      });

      // Return the records
      res.status(200).json(response);
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving all units:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Method to retrieve a Unit by its IDNo
  getUnitByIdNo: async (req, res) => {
    try {
      // Fetch a single Unit record by its IDNo
      const unit = await Unit.findOne({
        where: { IDNo: req.params.id },
        order: Sequelize.col("IDNo"),
      });

      // Check if the record exists
      if (!unit) {
        return res.status(404).json({ msg: "Unit not found" });
      }

      // Return the record
      res.status(200).json(unit);
    } catch (error) {
      // Log and handle errors
      console.error("Error retrieving unit by IDNo:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Method to create a new Unit record
  createUnit: async (req, res) => {
    try {
      // Create a new Unit record with the provided data
      const unit = await Unit.create(req.body);

      // Return the created record
      res.status(201).json(unit);
    } catch (error) {
      // Log and handle errors
      console.error("Error creating unit:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Method to update an existing Unit record by its IDNo
  updateUnit: async (req, res) => {
    try {
      // Update the Unit record with the provided data
      const updated = await Unit.update(req.body, {
        where: { IDNo: req.params.id },
      });

      // Check if any record was updated
      if (updated[0] === 0) {
        return res.status(404).json({ msg: "Record not found" });
      }

      // Return success message
      res.status(200).json({ msg: "Record updated successfully" });
    } catch (error) {
      // Log and handle errors
      console.error("Error updating unit:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Method to delete a Unit record by its IDNo
  deleteUnit: async (req, res) => {
    try {
      // Delete the record
      const deleted = await Unit.destroy({
        where: { IDNo: req.params.id },
      });

      // Check if any record was deleted
      if (!deleted) {
        return res.status(404).json({ msg: "Record not found" });
      }

      // Return success message
      res.status(200).json({ msg: "Record deleted successfully" });
    } catch (error) {
      // Log and handle errors
      console.error("Error deleting unit:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },
};
