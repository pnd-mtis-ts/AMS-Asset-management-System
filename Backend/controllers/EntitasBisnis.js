// Importing necessary modules and models
import { Sequelize } from "sequelize";
import EntitasBisnis from "../models/EntitasBisnisModel.js";

// EntitasBisnisController contains methods for handling operations on EntitasBisnis
export const EntitasBisnisController = {
  // Method to retrieve all EntitasBisnis records
  getAllEntitasBisnis: async (req, res) => {
    try {
      // Fetch all EntitasBisnis with specific attributes
      const response = await EntitasBisnis.findAll({
        attributes: ["IDNo", "EBCode", "EBName", "IP"],
      });
      // Return the records
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching EntitasBisnis records:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to retrieve an EntitasBisnis by IDNo
  getEntitasBisnisByIdNo: async (req, res) => {
    try {
      // Fetch a single EntitasBisnis record by IDNo
      const entitas = await EntitasBisnis.findOne({
        where: { IDNo: req.params.id },
        attributes: ["IDNo", "EBCode", "EBName", "IP"],
        order: Sequelize.col("IDNo"),
      });
      // Check if the record exists
      if (entitas) {
        res.status(200).json(entitas);
      } else {
        res.status(404).json({ msg: "EntitasBisnis not found" });
      }
    } catch (error) {
      console.error("Error fetching EntitasBisnis by IDNo:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to create a new EntitasBisnis record
  createEntitasBisnis: async (req, res) => {
    try {
      // Create a new EntitasBisnis record with the provided data
      const entitas = await EntitasBisnis.create(req.body);
      // Return the created record
      res.status(201).json(entitas);
    } catch (error) {
      console.error("Error creating EntitasBisnis:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to update an existing EntitasBisnis record by IDNo
  updateEntitasBisnis: async (req, res) => {
    try {
      // Update the record with the provided data
      const [updated] = await EntitasBisnis.update(req.body, {
        where: { IDNo: req.params.id },
      });
      // Check if any record was updated
      if (updated) {
        res.status(200).json({ msg: "Record updated successfully" });
      } else {
        res.status(404).json({ msg: "Record not found" });
      }
    } catch (error) {
      console.error("Error updating EntitasBisnis:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to delete an EntitasBisnis record by IDNo
  deleteEntitasBisnis: async (req, res) => {
    try {
      // Delete the record
      const deleted = await EntitasBisnis.destroy({
        where: { IDNo: req.params.id },
      });
      // Check if any record was deleted
      if (deleted) {
        res.status(200).json({ msg: "Record deleted successfully" });
      } else {
        res.status(404).json({ msg: "Record not found" });
      }
    } catch (error) {
      console.error("Error deleting EntitasBisnis:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
