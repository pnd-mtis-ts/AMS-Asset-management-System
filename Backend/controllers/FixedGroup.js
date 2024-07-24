// Importing necessary model
import FixedGroup from "../models/FixedGroupModel.js";

// FixedGroupController contains methods for handling operations on FixedGroup
export const FixedGroupController = {
  // Method to retrieve all FixedGroup records
  getAllFixedGroup: async (req, res) => {
    try {
      // Fetch all FixedGroup records with specific attributes
      const response = await FixedGroup.findAll({
        attributes: ["AccNo", "Name", "IDNo", "Status"],
      });
      // Return the records
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching all FixedGroup records:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to retrieve a FixedGroup by IDNo
  getFixedGroupById: async (req, res) => {
    try {
      // Fetch a single FixedGroup record by IDNo
      const fixedGR = await FixedGroup.findOne({
        attributes: ["AccNo", "Name", "IDNo", "Status"],
        where: { IDNo: req.params.id },
      });
      if (!fixedGR) {
        return res.status(404).json({ msg: "FixedGroup not found" });
      }
      // Return the record
      res.status(200).json(fixedGR);
    } catch (error) {
      console.error("Error fetching FixedGroup by IDNo:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to create a new FixedGroup record
  createFixedGroup: async (req, res) => {
    try {
      // Create a new FixedGroup record with the provided data
      const fixedGroup = await FixedGroup.create(req.body);
      // Return the created record
      res.status(201).json(fixedGroup);
    } catch (error) {
      console.error("Error creating FixedGroup:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to update an existing FixedGroup record by IDNo
  updateFixedGroup: async (req, res) => {
    try {
      // Update the record with the provided data
      const updated = await FixedGroup.update(req.body, {
        where: { IDNo: req.params.id },
      });
      // Check if any record was updated
      if (updated[0] > 0) {
        res.status(200).json({ msg: "FixedGroup record updated successfully" });
      } else {
        res.status(404).json({ msg: "FixedGroup record not found" });
      }
    } catch (error) {
      console.error("Error updating FixedGroup:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to delete a FixedGroup record by IDNo
  deleteFixedGroup: async (req, res) => {
    try {
      // Delete the record
      const deleted = await FixedGroup.destroy({
        where: { IDNo: req.params.id },
      });
      // Check if any record was deleted
      if (deleted) {
        res.status(200).json({ msg: "FixedGroup record deleted successfully" });
      } else {
        res.status(404).json({ msg: "FixedGroup record not found" });
      }
    } catch (error) {
      console.error("Error deleting FixedGroup:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
